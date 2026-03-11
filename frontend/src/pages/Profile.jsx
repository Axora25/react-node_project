import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Tablet, Edit2, Camera, Trash2, Home, LogOut, FileText, AlertTriangle } from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        role: 'farmer',
        farmName: '',
        farmSize: '',
        location: '',
        profileImage: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            // For now, since backend isn't ready, we'll try to fetch from localStorage user data
            // and fallback to an API call when ready.
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
            } else {
                // Fallback to localStorage if API fails (useful for development before backend is fully sync'd)
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    setProfileData(prev => ({
                        ...prev,
                        ...storedUser
                    }));
                }
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setProfileData(prev => ({
                    ...prev,
                    ...storedUser
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const updatedData = await response.json();
            setProfileData(updatedData);
            localStorage.setItem('user', JSON.stringify(updatedData));
            setIsEditing(false);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/profile/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const data = await response.json();
            setProfileData(prev => ({ ...prev, profileImage: data.profileImage }));

            // Update local storage user data to include new image
            const storedUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...storedUser, profileImage: data.profileImage }));

            setSuccess('Profile image updated!');
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
        </div>
    );

    const getProfileImageUrl = () => {
        if (profileData.profileImage) {
            if (profileData.profileImage.startsWith('http')) return profileData.profileImage;
            return `http://localhost:5000${profileData.profileImage}`;
        }
        return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // Fallback placeholder
    };

    return (
        <div className="min-h-screen bg-gray-950 font-sans text-gray-200 py-12 px-4 sm:px-6 lg:px-8 pt-12">
            <div className="max-w-4xl mx-auto">
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5" />
                        <p>{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-xl flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 rotate-180" />
                        <p>{success}</p>
                    </div>
                )}

                <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
                    {/* Header/Cover */}
                    <div className="h-48 bg-gradient-to-r from-lime-600 to-green-800 relative">
                        <div className="absolute -bottom-0 left-8 flex flex-col md:flex-row items-end gap-6 text-white">
                            <div className="relative group">
                                <img
                                    src={getProfileImageUrl()}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-gray-900 object-cover shadow-xl bg-gray-800"
                                />
                                <label className="absolute bottom-2 right-2 p-2 bg-lime-500 text-black rounded-lg cursor-pointer hover:bg-lime-400 transition-all opacity-0 group-hover:opacity-100 shadow-lg">
                                    <Camera className="h-4 w-4" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                                <div className="text-lime-200 flex items-center gap-2">
                                    <span className="bg-lime-500/20 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider">
                                        {profileData.role}
                                    </span>
                                    {profileData.email}
                                </div>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all border border-white/20"
                            >
                                <Edit2 className="h-4 w-4" /> Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="pt-12 pb-12 px-8">
                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Personal Information</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleInputChange}
                                            className="w-full !bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-white"
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Profile Image</label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-800 border border-gray-700">
                                                <img 
                                                    src={getProfileImageUrl()} 
                                                    alt="Preview" 
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <label className="flex-1 cursor-pointer">
                                                <div className="bg-gray-800 border border-dashed border-gray-700 hover:border-lime-500/50 rounded-xl px-4 py-3 text-center transition-all group">
                                                    <span className="text-gray-400 group-hover:text-lime-400 text-sm flex items-center justify-center gap-2">
                                                        <Camera className="h-4 w-4" /> Change Photo
                                                    </span>
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                    onChange={handleImageUpload}
                                                    disabled={submitting}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            className="w-full !bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-gray-500 cursor-not-allowed"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Farm Information</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Farm Name</label>
                                        <input
                                            type="text"
                                            name="farmName"
                                            placeholder="e.g. Green Valley Farm"
                                            value={profileData.farmName}
                                            onChange={handleInputChange}
                                            className="w-full !bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-white"
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Farm Size (Acres)</label>
                                            <input
                                                type="number"
                                                name="farmSize"
                                                placeholder="0"
                                                value={profileData.farmSize}
                                                onChange={handleInputChange}
                                                className="w-full !bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-white"
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="City, State"
                                                value={profileData.location}
                                                onChange={handleInputChange}
                                                className="w-full !bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-white"
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-4 pt-6 border-t border-gray-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-all text-gray-300"
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 rounded-xl bg-lime-500 hover:bg-lime-600 text-black font-bold transition-all disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Updating...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                            <User className="h-5 w-5 text-lime-500" /> Personal Details
                                        </h3>
                                        <div className="grid gap-4 text-sm">
                                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                                <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">Full Name</span>
                                                <span className="text-white font-medium">{profileData.name}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                                <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">Email</span>
                                                <span className="text-white font-medium">{profileData.email}</span>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                            <Tablet className="h-5 w-5 text-lime-500" /> Account Context
                                        </h3>
                                        <div className="grid gap-4 text-sm text-gray-400">
                                            <p>You have been a member since <span className="text-white">{new Date(profileData.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>.</p>
                                        </div>
                                    </section>
                                </div>

                                <div className="space-y-8">
                                    <section>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                                            <Home className="h-5 w-5 text-lime-500" /> Farm Overview
                                        </h3>
                                        <div className="grid gap-4 text-sm">
                                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                                <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">Farm Name</span>
                                                <span className="text-white font-medium">{profileData.farmName || 'Not set'}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                                <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">Size (Acres)</span>
                                                <span className="text-white font-medium">{profileData.farmSize || '0'}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                                <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold">Location</span>
                                                <span className="text-white font-medium flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {profileData.location || 'Not set'}
                                                </span>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Global actions */}
                {!isEditing && (
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center text-sm font-bold">
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 bg-gray-900 border border-gray-800 px-6 py-3 rounded-2xl hover:bg-gray-800 transition-all"
                            >
                                <Home className="h-4 w-4 text-lime-500" /> Back Home
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-900/20 border border-red-900/50 text-red-500 px-8 py-3 rounded-2xl hover:bg-red-900/30 transition-all font-bold"
                        >
                            <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
