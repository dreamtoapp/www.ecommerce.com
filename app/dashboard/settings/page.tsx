import { fetchCompany } from './actions/fetchCompany';
import CompanyProfileForm from './component/CompanyProfileForm';

// Main Component
export default async function SettingsPage() {


  const companyData = await fetchCompany();



  return (
    <div className='container mx-auto bg-background p-8 text-foreground'>
      <h1 className='mb-6 text-center text-3xl font-bold'>إعدادات المنصة</h1>
      <CompanyProfileForm company={companyData} />
    </div>
  );
}
