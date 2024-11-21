import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getSingleUserApi, updateUserProfile } from '../../apis/api';
import FooterCard from '../../components/FooterCard';
import './Profile.css'; // Import the CSS file

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('userData'));
    const id = user._id;

    const [fullname, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await getSingleUserApi(id);
                setFullName(res.data.data.fullname);
                setUsername(res.data.data.username);
                setAge(res.data.data.age);
                setEmail(res.data.data.email);
                setPhone(res.data.data.phone);
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!fullname || !username || !age || !email || !phone) {
            toast.error('Please fill in all fields');
            return;
        }

        const formData = { fullname, username, age, email, phone };

        console.log('Updating profile with data:', formData); // Debug log

        try {
            const res = await updateUserProfile(id, formData);
            console.log('API response:', res); // Debug log

            if (res.status === 200) {
                toast.success('Profile updated successfully');
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
            toast.error('Failed to update profile');
        }
    };

    return (
        <>
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-left">
                        <div className="profile-info">
                            <h2>{fullname}</h2>
                            <p>{email}</p>
                        </div>
                    </div>
                    <div className="profile-right">
                        <h1>User Details</h1>
                        <form className="profile-form" onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    value={fullname}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="form-group-grid">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="Enter your username"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="age">Age</label>
                                    <input
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        type="number"
                                        id="age"
                                        name="age"
                                        placeholder="Enter your age"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <button type="submit" className="profile-btn">Update Profile</button>
                        </form>
                    </div>
                </div>
            </div>

            <FooterCard />
        </>
    );
};

export default Profile;
