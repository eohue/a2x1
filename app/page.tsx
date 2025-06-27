import { HeroSection } from '@/components/HeroSection';
import { ProjectsPreview } from '@/components/projects/ProjectsPreview';
import { CommunityPreview } from '@/components/community/CommunityPreview';
import { ImpactMetrics } from '@/components/ImpactMetrics';
import { ApplicationCTA } from '@/components/ApplicationCTA';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <main className="overflow-x-hidden">
        {/* Hero Section with Vision & Impact */}
        <HeroSection />
        
        {/* Impact Metrics Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <ImpactMetrics />
          </div>
        </section>
        
        {/* Projects Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                우리의 프로젝트
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                아이부키가 만들어가는 다양한 사회주택 프로젝트를 만나보세요.
                각 프로젝트는 고유한 커뮤니티와 특색있는 주거 환경을 제공합니다.
              </p>
            </div>
            <ProjectsPreview />
          </div>
        </section>
        
        {/* Community Preview Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                함께하는 커뮤니티
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                입주민들의 생생한 일상과 활동을 들여다보고,
                함께 만들어가는 공동체의 따뜻한 이야기를 경험해보세요.
              </p>
            </div>
            <CommunityPreview />
          </div>
        </section>
        
        {/* Application CTA Section */}
        <section className="py-16 bg-primary-50">
          <div className="container mx-auto px-4">
            <ApplicationCTA />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
