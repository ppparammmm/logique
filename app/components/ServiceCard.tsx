interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function ServiceCard({ icon, title, description, gradientFrom, gradientTo }: ServiceCardProps) {
  return (
    <div className="glass-effect rounded-xl p-8 hover-glow">
      <div className={`w-16 h-16 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-lg flex items-center justify-center mb-6`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/70 mb-6">{description}</p>
      <button className="text-indigo-400 hover:text-indigo-300 font-semibold">
        Learn More →
      </button>
    </div>
  );
} 