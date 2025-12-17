"use client";

import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import AnimatedSection from "@/components/AnimatedSection";

export default function PaymentsPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const courseParam = searchParams.get("course");

  const [course, setCourse] = useState(courseParam || "");
  const [whatsapp, setWhatsapp] = useState("");
  const [upiName, setUpiName] = useState(session?.user?.name || "");
  const [upiId, setUpiId] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submissionStatus, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (courseParam) setCourse(courseParam);
  }, [courseParam]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AnimatedSection>
          <Card className="max-w-md w-full text-center py-12">
            <AlertCircle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in with Google to proceed with your payment.</p>
            <Button onClick={() => signIn("google")}>Sign In with Google</Button>
          </Card>
        </AnimatedSection>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course,
          whatsapp,
          upiName,
          upiId,
          transactionId,
          // userEmail is handled server-side from session
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setWhatsapp("");
      setTransactionId("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Left Col: Instructions & QR */}
        <AnimatedSection className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
            <p className="text-gray-600 mt-2">Scan the QR code to pay via UPI.</p>
          </div>

          <Card className="p-8 flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {/* Placeholder for UPI QR - User said it exists at /payments/upi-qr.jpg */}
              <img
                src="/payments/upi-qr.jpg"
                alt="UPI QR Code"
                className="w-full max-w-xs h-auto object-contain rounded-xl shadow-lg"
              />
            </motion.div>
            <div className="mt-6 text-center">
              <p className="font-mono text-sm bg-gray-100 px-3 py-1 rounded inline-block text-gray-700">UPI ID: 9037602265@fam</p>
              <p className="text-xs text-gray-400 mt-2">*Use any UPI App (GPay, PhonePe, Paytm)</p>
            </div>
          </Card>
        </AnimatedSection>

        {/* Right Col: Form */}
        <AnimatedSection delay={0.2} className="relative">
          <Card>
            <AnimatePresence mode="wait">
              {submissionStatus === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h2>
                  <p className="text-gray-600 mb-8">
                    Your transaction details have been recorded. We will verify it shortly.
                    <br /><br />
                    You can browse our other courses while we verify this payment.
                  </p>
                  <Link href="/courses">
                    <Button className="bg-black text-white hover:bg-gray-800">
                      Browse Other Courses
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold mb-6">Payment Details</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your UPI Name</label>
                    <Input
                      value={upiName}
                      onChange={(e) => setUpiName(e.target.value)}
                      placeholder="Name as per UPI App"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your UPI ID</label>
                    <Input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. name@okhdfcbank"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selected Course / Purpose</label>
                    <Input
                      placeholder="e.g. Recovery Foundation"
                      value={course}
                      disabled
                      className="bg-gray-50 text-gray-500 cursor-not-allowed"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Pay</label>
                    <Input
                      value={(() => {
                        const p = searchParams.get("price") || "0";
                        return p.startsWith("₹") ? p : "₹" + p;
                      })()}
                      disabled
                      className="bg-gray-50 font-bold text-gray-900 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                    <Input
                      type="tel"
                      placeholder="Enter your WhatsApp number"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">We will contact you here for verification.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR</label>
                    <Input
                      placeholder="Enter 12-digit UPI Ref ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                    />
                  </div>

                  {submissionStatus === "error" && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errorMessage}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={submissionStatus === "loading"}
                  >
                    {submissionStatus === "loading" ? (
                      <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={18} /> Verifying...</span>
                    ) : (
                      "Confirm Payment"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </Card>
        </AnimatedSection>

      </div>
    </div>
  );
}
