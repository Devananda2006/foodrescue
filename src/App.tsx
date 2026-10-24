import React, { useState, useEffect } from 'react';
import { Donation } from './types/food';
import { loadStoredDonations, saveStoredDonations, resetStoredDonations } from './data/mockDonations';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { AvailableFood } from './components/AvailableFood';
import { DonateFood } from './components/DonateFood';
import { SmartMatching } from './components/SmartMatching';
import { SurplusEstimator } from './components/SurplusEstimator';
import { ImpactDashboard } from './components/ImpactDashboard';
import { ClaimModal } from './components/ClaimModal';
import { Footer } from './components/Footer';
import { CheckCircle2, Info } from 'lucide-react';

export default function App() {
  const [donations, setDonations] = useState<Donation[]>(() => loadStoredDonations());
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [claimingDonation, setClaimingDonation] = useState<Donation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    saveStoredDonations(donations);
  }, [donations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Add new donation handler
  const handleAddDonation = (newDonation: Donation) => {
    setDonations((prev) => [newDonation, ...prev]);
    showToast(`"${newDonation.title}" listed successfully on the community board!`);
  };

  // Claim donation handler
  const handleConfirmClaim = (
    donationId: string,
    recipientInfo: { claimedBy: string; claimedPhone: string; claimedNotes: string }
  ) => {
    setDonations((prev) =>
      prev.map((item) => {
        if (item.id === donationId) {
          return {
            ...item,
            status: 'claimed',
            claimedBy: recipientInfo.claimedBy,
            claimedPhone: recipientInfo.claimedPhone,
            claimedNotes: recipientInfo.claimedNotes,
            claimedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showToast(`Donation claimed by ${recipientInfo.claimedBy}. Pickup coordinated!`);
  };

  // Confirm delivery handler (transitions from claimed to delivered)
  const handleConfirmDelivered = (donationId: string) => {
    setDonations((prev) =>
      prev.map((item) => {
        if (item.id === donationId) {
          return {
            ...item,
            status: 'delivered',
            deliveredAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showToast('Donation verified as delivered! Sustainability metrics updated.');
  };

  // Reset demo data handler
  const handleResetDemo = () => {
    const defaultData = resetStoredDonations();
    setDonations(defaultData);
    showToast('Demo data restored to initial hackathon sample listings.');
  };

  // Pre-fill donation from surplus estimator
  const handlePreFillFromEstimator = (data: {
    title: string;
    quantityKg: number;
    estimatedPortions: number;
    category: string;
  }) => {
    setCurrentTab('donate');
    showToast(`Transferred ${data.quantityKg} kg surplus estimate to donation form.`);
  };

  const availableCount = donations.filter((d) => d.status === 'available').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-[#1c2b21] selection:bg-emerald-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        availableCount={availableCount}
        onResetDemo={handleResetDemo}
      />

      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'home' && (
          <HomeHero
            donations={donations}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'available' && (
          <AvailableFood
            donations={donations}
            onOpenClaimModal={(donation) => setClaimingDonation(donation)}
            onConfirmDelivered={handleConfirmDelivered}
            onNavigateToDonate={() => setCurrentTab('donate')}
          />
        )}

        {currentTab === 'donate' && (
          <DonateFood
            onAddDonation={handleAddDonation}
            onNavigateToAvailable={() => setCurrentTab('available')}
          />
        )}

        {currentTab === 'matching' && (
          <SmartMatching
            donations={donations}
            onOpenClaimModal={(donation) => setClaimingDonation(donation)}
          />
        )}

        {currentTab === 'estimator' && (
          <SurplusEstimator
            onPreFillDonation={handlePreFillFromEstimator}
          />
        )}

        {currentTab === 'impact' && (
          <ImpactDashboard
            donations={donations}
            onResetDemo={handleResetDemo}
            onNavigateToAvailable={() => setCurrentTab('available')}
          />
        )}
      </main>

      {/* Claim Modal */}
      <ClaimModal
        donation={claimingDonation}
        isOpen={Boolean(claimingDonation)}
        onClose={() => setClaimingDonation(null)}
        onConfirmClaim={handleConfirmClaim}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
