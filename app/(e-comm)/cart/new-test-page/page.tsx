import ServerCartView from '../components/ServerCartView';
import BackButton from '@/components/BackButton';

export default function CartServerTestPage() {
    return (
        <div className="max-w-2xl mx-auto py-8 flex flex-col gap-6">
            <BackButton variant="default" />
            <ServerCartView />
        </div>
    );
} 