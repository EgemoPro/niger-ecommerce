import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus } from "lucide-react";

const EcommerceDashboardPopup = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[80vw] w-4/5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Tableau de bord de votre boutique</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Votre boutique est en ligne</h3>
            <p className="text-base text-gray-600 mb-6">Les mises à jour seront publiées automatiquement.</p>
            
            <div className="mb-6">
              <label className="text-lg font-semibold">URL de la boutique</label>
              <div className="flex mt-2">
                <Input value="maboutique.ecommerce.com" readOnly className="rounded-r-none text-lg" />
                <Button variant="outline" className="rounded-l-none"><Copy className="h-6 w-6" /></Button>
              </div>
            </div>
            
            <Button variant="link" className="text-lg p-0"><Plus className="h-6 w-6 mr-2" /> Ajouter un domaine personnalisé</Button>

            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Scannez pour ouvrir l'app</h4>
              <div className="bg-gray-100 p-6 rounded-lg flex justify-center items-center">
                <img src="/api/placeholder/200/200" alt="QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-center mt-4 text-gray-600">Scannez ce code avec votre téléphone pour ouvrir votre boutique dans l'app.</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Inviter des collaborateurs</h3>
            <p className="text-base text-gray-600 mb-6">Nous leur enverrons des instructions et un lien pour créer un compte.</p>
            
            <div className="flex mb-6">
              <Input placeholder="Entrez l'adresse e-mail" className="rounded-r-none text-lg" />
              <Button className="rounded-l-none text-lg">Inviter</Button>
            </div>

            <div className="space-y-4">
              {[
                { name: "Jean Dupont", email: "jean@example.com", status: "Invité envoyé" },
                { name: "Marie Martin", email: "marie@example.com", status: "Invitation acceptée" },
                { name: "Pierre Durand", email: "pierre@example.com", status: "Actif" },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold">{user.name}</p>
                      <p className="text-base text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={user.status === "Actif" ? "success" : "secondary"} className="text-base">
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-lg font-semibold">3/5 sièges d'équipe utilisés</p>
              <p className="text-base text-gray-600">Vous pouvez mettre à niveau votre compte pour ajouter plus d'utilisateurs à votre équipe.</p>
              <Button variant="link" className="text-lg p-0 mt-4">Gérer</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EcommerceDashboardPopup;