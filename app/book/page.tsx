import InfiniteMenu from "../components/InfiniteMenu";

const items = [
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80",
    link: "https://google.com/",
    title: "Book a Stargazing Tour",
    description: "Reserve your spot for an unforgettable night under the stars with our expert guides.",
  },
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/astrophoto",
    title: "Astrophotography Session",
    description: "Capture the cosmos with our professional astrophotography packages.",
  },
  {
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80",
    link: "https://example.com/vr",
    title: "Virtual Reality Experience",
    description: "Explore the universe from home with our immersive VR tours.",
  },
];

export default function BookPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0a0a" }}>
      <InfiniteMenu items={items} />
    </div>
  );
} 