interface ContactInfoProps {
  icon: string;
  title: string;
  value: string;
}

export default function ContactInfo({ icon, title, value }: ContactInfoProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
        <span className="text-white">{icon}</span>
      </div>
      <div>
        <div className="text-white font-semibold">{title}</div>
        <div className="text-white/60">{value}</div>
      </div>
    </div>
  );
} 