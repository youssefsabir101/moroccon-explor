
import DirectoryExplorer from "../../components/DirectoryExplorer";

const SERVICE_ENDPOINTS = [
  "hospitals",
  "clinics",
  "pharmacies",
];

export default function ServicesPage() {
  return (
    <DirectoryExplorer
      title="Services au Maroc"
      description="Recherchez des services de santé et des établissements utiles dans les villes marocaines."
      endpoints={SERVICE_ENDPOINTS}
    />
  );
}
