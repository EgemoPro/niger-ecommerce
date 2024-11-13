import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button } from "./ui/button";
import { FileDown } from "lucide-react";
import { useSelector } from 'react-redux';

export const ExportPDF = () => {
    const data = useSelector(state => state.basket)

  const handleExport = () => {
    const doc = new jsPDF();
    
    // En-tête du document
    doc.setFontSize(20);
    doc.text('Panier', 14, 22);
    
    // Préparation des données
    const tableData = data.map(item => [
      item.title,
      item.quantity,
      item.price + ' FCFA',
      (item.quantity * item.price) + ' FCFA'
    ]);

    // Calcul du total
    const total = data.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    // Génération du tableau
    doc.autoTable({
      head: [['Produit', 'Quantité', 'Prix unitaire', 'Total']],
      body: [
        ...tableData,
        ['', '', 'Total:', total + ' FCFA']
      ],
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save('panier.pdf');
  };
        
  return (
    <Button onClick={handleExport} className="flex items-center gap-3 w-full sm:w-auto" variant="outline" size="sm">
      <FileDown className="mr-2 h-4 w-4" />
      Exporter PDF
    </Button>
  );
};