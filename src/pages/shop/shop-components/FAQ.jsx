
import { useParams } from "react-router-dom";
import { popularShops } from "@/components/PopularShops";
import { HelpCircle } from "lucide-react";

export default function ShopFAQ() {
  const { id } = useParams();
  const shop = popularShops.find((s) => s.id === id);

  if (!shop) return null;

  const faqs = [
    { question: "Comment passer commande ?", answer: "Lorem ipsum dolor sit amet..." },
    { question: "Quels sont les délais de livraison ?", answer: "Lorem ipsum dolor sit amet..." },
    { question: "Comment retourner un article ?", answer: "Lorem ipsum dolor sit amet..." },
    { question: "Quels sont les moyens de paiement acceptés ?", answer: "Lorem ipsum dolor sit amet..." },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-primary" />
        Questions fréquentes
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <button className="w-full p-6 text-left">
              <h3 className="font-medium text-lg text-secondary-foreground group-hover:text-primary transition-colors">
                {faq.question}
              </h3>
              <p className="mt-2 text-secondary">{faq.answer}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
