"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AllUserMedia from "@/components/AllUserMedia";

interface Media {
  id: number;
  name: string;
  description?: string | null; // Accept both undefined and null
  photo?: string;
  categoryId: number;
}

interface AddMediaPageProps {
  userId: string | null;
}

const AllMediaPage = ({ userId }: AddMediaPageProps) => {
  const [categories, setCategories] = useState<
    { id: number; name: string }[] | undefined
  >(undefined);
  const [userMedia, setUserMedia] = useState<Media[]>([]); // State to store media created by the user
  const [loading, setLoading] = useState(true); // Loading state for user fetch

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch media created by the user from the API
  useEffect(() => {
    const fetchUserMedia = async () => {
      if (!userId) return; // Ensure we only fetch media when we have a user ID
      try {
        const response = await fetch(`/api/media/user/${userId}`);
        const data = await response.json();
        setUserMedia(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Failed to load user media:", error);
        setLoading(false); // Stop loading even if there is an error
      }
    };

    fetchUserMedia();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>; // Display loading state while fetching user
  }

  return <AllUserMedia categories={categories ?? []} media={userMedia} />;
};

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // Track if the component is mounted
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to control the popup

  useEffect(() => {
    // Set mounted to true only after the component has mounted in the client
    setMounted(true);

    const fetchUser = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (data?.user) {
        setUserId(data.user.id ?? null); // Ensure userId is not undefined
        setUserEmail(data.user.email ?? null); // Ensure userEmail is not undefined
      }
    };

    fetchUser();
  }, []);

  // Function to open/close the popup
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Return null for the server-side rendering to avoid hydration mismatch
  if (!mounted) {
    return null; // Do not render anything on the server side to avoid mismatch
  }

  return (
    <div>
      {/* Trigger to open the popup */}
      <h1 className="text-center">Dashboard</h1>
      <h2 className="text-center">{userEmail}</h2>

      {/* Render AllMediaPage passing userId */}
      <AllMediaPage userId={userId} />
    </div>
  );
}
