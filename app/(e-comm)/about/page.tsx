import {
  Award,
  Droplet,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react'; // Import directly

import Link from '@/components/link';
import BackButton from '@/components/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getFeaturedTestimonials } from './actions/getTestimonials';
import TestimonialSlider from './components/TestimonialSlider';

const AboutUsPage = async () => {
  const testimonials = await getFeaturedTestimonials();

  // Debug: Log the actual data received
  // Removed console.logs for cleaner build output

  const features = [
    {
      icon: Truck,
      title: 'توصيل فوري',
      description: 'أسطولنا الحديث يصلك أينما كنت، بسرعة وكفاءة، لضمان راحتك دائمًا.',
    },
    {
      icon: Star,
      title: 'جودة لا تضاهى',
      description: 'مياهنا معتمدة عالميًا، مفلترة بتقنيات متطورة لنقاء لا مثيل له.',
    },
    {
      icon: MapPin,
      title: 'تغطية شاملة',
      description: 'فروعنا منتشرة لنكون دائمًا بالقرب منك، جاهزون لخدمتك في أي وقت.',
    },
    {
      icon: Droplet,
      title: 'تركيبة صحية',
      description: 'مياه غنية بالمعادن الأساسية لدعم صحتك ونشاطك اليومي.',
    },
    {
      icon: ShieldCheck,
      title: 'أمان مضمون',
      description: 'اختبارات جودة يومية لضمان سلامتك وراحة بالك.',
    },
    {
      icon: Award,
      title: 'ثقة وتميز',
      description: 'نفخر بخدمة آلاف العملاء بجودة وثقة لا تتزعزع.',
    },
  ];

  return (
    <div className='container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className="mb-8">
        <BackButton variant="minimal" />
      </div>

      {/* Hero Section */}
      <header className='animate-fade-in-up text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-foreground'>
          أمواج <span className='text-feature-suppliers'>|</span> مياه نقية لحياة صحية
        </h1>
        <p className='mx-auto mt-4 max-w-3xl text-lg md:text-xl text-muted-foreground'>
          نحن في أمواج نؤمن أن الماء ليس مجرد حاجة، بل هو أساس الحياة الصحية. نقدم لكم مياهًا نقية بأعلى معايير الجودة العالمية.
        </p>
      </header>

      {/* Mission Card */}
      <section className='mb-16 animate-fade-in-up' style={{ animationDelay: '200ms' }}>
        <Card className="shadow-lg border-l-4 border-feature-suppliers card-hover-effect card-border-glow text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl md:text-3xl">
              <Heart className="h-7 w-7 text-feature-suppliers icon-enhanced" />
              رسالتنا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-md md:text-lg text-muted-foreground max-w-2xl mx-auto'>
              نسعى لتوفير مياه شرب نقية وصحية لكل منزل ومكتب في المملكة، مع الالتزام بالاستدامة البيئية والجودة العالمية، لنكون جزءًا من حياة صحية ومستدامة لمجتمعنا.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Why Choose Us Section */}
      <section className='mb-16 animate-fade-in-up' style={{ animationDelay: '400ms' }}>
        <h2 className='text-3xl font-bold text-center mb-10'>لماذا تختار أمواج؟</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <Card key={index} className="shadow-lg border-t-4 border-feature-suppliers card-hover-effect card-border-glow text-center">
              <CardHeader className="items-center">
                <div className="bg-feature-suppliers-soft p-3 rounded-full">
                  <feature.icon className="h-8 w-8 text-feature-suppliers icon-enhanced" />
                </div>
              </CardHeader>
              <CardContent>
                <h3 className='text-xl font-semibold text-foreground mb-2'>{feature.title}</h3>
                <p className='text-muted-foreground text-sm'>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='mb-16 animate-fade-in-up' style={{ animationDelay: '600ms' }}>
        <h2 className='text-3xl font-bold text-center mb-4'>ماذا يقول عملاؤنا؟</h2>
        <p className='text-center text-muted-foreground mb-10'>
          تقييمات مميزة من عملائنا الكرام تعكس جودة خدماتنا الاستثنائية
        </p>
        <TestimonialSlider testimonials={testimonials} />
      </section>

      {/* Call to Action Section */}
      <section className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <div className="bg-gradient-to-r from-feature-suppliers to-feature-commerce text-primary-foreground rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-2">جاهز لتجربة النقاء؟</h2>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            انضم إلى آلاف العملاء السعداء واستمتع بمياه أمواج النقية التي تصلك حتى باب منزلك.
          </p>
          <Link href="/#products" passHref>
            <Button
              size="lg"
              className="bg-primary-foreground text-feature-suppliers font-bold hover:bg-white/90 transform hover:scale-105 transition-transform"
            >
              اطلب الآن
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
