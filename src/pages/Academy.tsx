import { useStore } from '../store/useStore';
import AcademySettings from '../components/AcademySettings';

export default function AcademyPage() {
  const { academies, setAcademies, selectedAcademyId, setSelectedAcademyId, showToast } =
    useStore();

  return (
    <AcademySettings
      academies={academies}
      setAcademies={setAcademies as any}
      selectedAcademyId={selectedAcademyId}
      setSelectedAcademyId={setSelectedAcademyId}
      showToast={showToast}
    />
  );
}
