import HeroSection from "@/components/section/HeroSection";
import MediaByCategory from "@/components/MediaByCategory";

const mockCategories = [
  { id: 1, name: "Anime" },
  { id: 2, name: "Movies" },
];

const mockMedia = [
  {
    id: 1,
    name: "Naruto",
    description: "Ninja anime",
    photo: "https://via.placeholder.com/150",
    categoryId: 1,
  },
  {
    id: 2,
    name: "One Piece",
    description: "Pirate anime",
    photo: "https://via.placeholder.com/150",
    categoryId: 1,
  },
  {
    id: 3,
    name: "Inception",
    description: "Dream within a dream",
    photo: "https://via.placeholder.com/150",
    categoryId: 2,
  },
];
export const metadata = {
  title: "Waifu Smash",
  description: "A description of my Next.js app wdd",
};
export default function Home() {
  return (
    <>
      <HeroSection />
      <MediaByCategory categories={mockCategories} media={mockMedia} />
    </>
  );
}
