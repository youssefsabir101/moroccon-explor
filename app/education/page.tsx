
import DirectoryExplorer from "../../components/DirectoryExplorer";

const EDUCATION_ENDPOINTS = ["schools", "universities"];

export default function EducationPage() {
  return (
    <DirectoryExplorer
      title="Éducation au Maroc"
      description="Explorez les établissements éducatifs et recherchez des informations par nom, ville ou région."
      endpoints={EDUCATION_ENDPOINTS}
    />
  );
}
