
import DirectoryExplorer from "../../components/DirectoryExplorer";

const SERVICE_ENDPOINTS = [
  "hospitals",
  "clinics",
  "pharmacies",
  "banks",
  "atms",
  "gas-stations",
  "parking",
  "mosques",
  "administrative-offices",
  "post-offices",
];

export default function ServicesPage() {
  return (
    <DirectoryExplorer
      title="Services au Maroc"
      description="Trouvez des hôpitaux, cliniques, pharmacies, banques, distributeurs, stations-service et services publics partout au Maroc."
      endpoints={SERVICE_ENDPOINTS}
    />
  );
}
