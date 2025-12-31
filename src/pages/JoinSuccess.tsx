import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ExternalLink, XCircle } from "lucide-react";
import { toast } from "sonner";

const JoinSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const communityId = useMemo(() => searchParams.get("communityId") || searchParams.get("community_id") || "", [searchParams]);
  const orderId = useMemo(() => searchParams.get("orderId") || searchParams.get("order_id") || "", [searchParams]);
  const paymentId = useMemo(() => searchParams.get("paymentId") || searchParams.get("payment_id") || "", [searchParams]);
  const signature = useMemo(() => searchParams.get("signature") || searchParams.get("razorpay_signature") || "", [searchParams]);

  const [loading, setLoading] = useState(true);
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!communityId || !orderId || !paymentId || !signature) {
        setError("Missing payment details.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/.netlify/functions/verify-razorpay-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            communityId,
            orderId,
            paymentId,
            signature,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data?.success || !data?.joinLink) {
          const message = data?.error || "Unable to verify payment.";
          setError(message);
          toast.error("Payment verification failed", { description: message });
          setLoading(false);
          return;
        }

        setJoinLink(data.joinLink);
        toast.success("Payment verified", { description: "You can now join the community." });
        setLoading(false);
      } catch (e: any) {
        const message = e?.message || String(e);
        setError("Unable to verify payment.");
        toast.error("Payment verification failed", { description: message });
        setLoading(false);
      }
    };

    run();
  }, [communityId, orderId, paymentId, signature]);

  return (
    <div className="flex flex-col min-h-screen font-sf-pro">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
          <Card className="apple-glass-card border-gray-800">
            <CardContent className="p-8">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-white text-lg font-semibold">Verifying your payment…</p>
                  <p className="text-gray-400 mt-2">This usually takes a few seconds.</p>
                </div>
              ) : joinLink ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="h-12 w-12 text-emerald-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Payment Successful</h1>
                  <p className="text-gray-400 mb-6">Your access is ready. Click below to join the community.</p>

                  <div className="space-y-3">
                    <Button
                      className="w-full py-6 text-lg font-medium shadow-lg hover:shadow-primary/20"
                      onClick={() => window.open(joinLink, "_blank", "noopener,noreferrer")}
                    >
                      Join Community
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/community/${encodeURIComponent(String(communityId))}`)}
                    >
                      Back to community
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <XCircle className="h-12 w-12 text-red-400" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Could not verify payment</h1>
                  <p className="text-gray-400 mb-6">{error || "Please try again."}</p>

                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={() => window.location.reload()}
                    >
                      Retry verification
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/community/${encodeURIComponent(String(communityId || ""))}`)}
                      disabled={!communityId}
                    >
                      Back to community
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JoinSuccess;
