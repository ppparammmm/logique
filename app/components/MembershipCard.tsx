interface MembershipCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
}

export default function MembershipCard({ title, price, period, features, isPopular = false }: MembershipCardProps) {
  return (
    <div className={`glass-effect rounded-xl p-8 text-center ${isPopular ? 'border-2 border-indigo-500 relative' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <div className="text-4xl font-bold text-white mb-2">{price}</div>
      <div className="text-white/60 mb-8">{period}</div>
      <ul className="text-white/80 space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-colors">
        Get Started
      </button>
    </div>
  );
} 