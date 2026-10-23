
import DirectoryExplorer from "../../components/DirectoryExplorer";

const EDUCATION_ENDPOINTS = [
  "schools",
  "universities",
];

export default function EducationPage() {
  return (
    <DirectoryExplorer
      title="Éducation au Maroc"
      description="Explorez les écoles et les universités marocaines et recherchez des établissements par ville ou région."
      endpoints={EDUCATION_ENDPOINTS}
    />
  );
}
