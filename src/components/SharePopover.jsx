import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Copy, Mail } from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";


const ShareButton = ({ label, btnIcon, onClick, disabled }) => (
  <Button
    onClick={onClick}
    // asChild
    className="flex items-center w-30 justify-start bg-rose-300 hover:bg-rose-500 px-4 py-3 gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {btnIcon}
    <span className="text-sm font-medium">{label}</span>
  </Button>
);

const SharePopover = ({
  productData = {
    title: document.title,
    description: "Découvrez ce produit exceptionnel !",
    url: window.location.href,
    image: "",
    price: ""
  }
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Génère les URLs de partage
  const generateShareUrls = () => {
    const { title, description, url, image, price } = productData;

    const shareText = price ?
      `${title} - ${price}€ | ${description}` :
      `${title} | ${description}`;

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + url)}`
    };
  };

  // Gère le partage sur une plateforme
  const handleShare = (platform) => {
    const shareUrls = generateShareUrls();
    const url = shareUrls[platform];

    if (url) {
      if (['facebook', 'twitter', 'linkedin'].includes(platform)) {
        window.open(url, 'share', 'width=600,height=400,scrollbars=yes,resizable=yes');
      } else {
        window.open(url, '_blank');
      }
    }
  };

  // Copie le lien
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productData.url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  // Partage natif (mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.title,
          text: productData.description,
          url: productData.url
        });
      } catch (error) {
        console.log('Partage annulé:', error);
      }
    }
  };

  const shareItems = [
    {
      label: "Facebook",
      btnIcon: <Facebook size={20} />,
      onClick: () => handleShare('facebook')
    },
    {
      label: "Twitter",
      btnIcon: <Twitter size={20} />,
      onClick: () => handleShare('twitter')
    },
    {
      label: "LinkedIn",
      btnIcon: <Linkedin size={20} />,
      onClick: () => handleShare('linkedin')
    },
    {
      label: "WhatsApp",
      btnIcon: <MessageCircle size={20} />,
      onClick: () => handleShare('whatsapp')
    },
    {
      label: "Email",
      btnIcon: <Mail size={20} />,
      onClick: () => handleShare('email')
    },
    {
      label: copySuccess ? "Copié !" : "Copier le lien",
      btnIcon: <Copy size={20} />,
      onClick: handleCopyLink,
      disabled: copySuccess
    }
  ];

  // Ajoute le partage natif si disponible
  if (navigator.share) {
    shareItems.unshift({
      label: "Partage rapide",
      btnIcon: <Share2 size={20} />,
      onClick: handleNativeShare
    });
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 size={18} className="text-gray-600" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56 p-1">
          <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wide">
            Partager
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div
            className="flex flex-col justify-start gap-2 p-1.5"
          >

          {/* Boucle sur les éléments de partage */}
          {shareItems.map((item, index) => (
            <DropdownMenuItem key={index} asChild>
              <ShareButton {...item} />
            </DropdownMenuItem>
          ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification de copie */}
      {copySuccess && (
        <div className="absolute top-full right-0 mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm z-50 animate-fade-in">
          Lien copié !
        </div>
      )}
    </div>
  );
};

export default SharePopover;