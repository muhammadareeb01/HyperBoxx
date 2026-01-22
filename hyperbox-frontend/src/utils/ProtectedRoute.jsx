import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const auth = getAuth();
    const db = getFirestore();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                
                // CHANGE: We now ALWAYS fetch the role, so we can check it for both Admin and User routes
                try {
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        setRole(docSnap.data().role);
                    } else {
                        setRole('user'); // Default
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setRole('user');
                }
            } else {
                setUser(null);
                setRole('guest');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth, db]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // --- SCENARIO 1: ADMIN ROUTE (requireAdmin={true}) ---
    if (requireAdmin) {
        // If not logged in -> Go to Login
        if (!user) {
            return <Navigate to="/login" replace />;
        }
        // If logged in but NOT admin -> Go to Home
        if (role !== 'admin') {
            return <Navigate to="/" replace />;
        }
        // If Admin -> Allow Access
        return children;
    }

    // --- SCENARIO 2: PUBLIC/USER ROUTE (requireAdmin={false}) ---
    // If user IS an admin, they should not see public pages -> Go to Admin Dashboard
    if (user && role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    // Otherwise, allow access (Includes Regular Users and Guests)
    return children;
};

export default ProtectedRoute;