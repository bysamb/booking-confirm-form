import { useState, useMemo } from "react";
import { Check, Mail, Hash, Loader2 } from "lucide-react";

type Stage = "form" | "submitting" | "success" | "error";

export default function ConfirmPage() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const emailParam = params.get("email") || "";
  const quoteParam = params.get("quote") || "";

  const [email, setEmail] = useState(emailParam);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);
  const [stage, setStage] = useState<Stage>("form");
  const [errorMsg, setErrorMsg] = useState("");

  const allConsented = consent1 && consent2 && consent3;
  const canSubmit = email.trim() !== "" && quoteParam !== "" && allConsented;

  async function handleSubmit() {
    if (!canSubmit) return;
    setStage("submitting");
    try {
      const res = await fetch("/api/confirm-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, quote: quoteParam }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStage("success");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStage("error");
    }
  }

  // Missing quote param — invalid link
  if (!quoteParam) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-[640px] text-center">
          <div className="bg-white rounded-2xl shadow-xl shadow-[#1B2A4A]/[0.08] border border-gray-200/80 p-10">
            <h2 className="text-xl font-bold text-[#1B2A4A] mb-2">Invalid Link</h2>
            <p className="text-sm text-gray-500">
              This confirmation link is missing required information. Please check the link you were sent.
            </p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            Powered by <span className="font-semibold text-gray-500">Guided Imports</span>
          </p>
        </div>
      </div>
    );
  }

  // Success screen
  if (stage === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-[640px]">
            <div className="bg-white rounded-2xl shadow-xl shadow-[#1B2A4A]/[0.08] border border-gray-200/80 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#1B2A4A] to-[#131F36] px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 text-center relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
                    backgroundSize: "100px 100px, 80px 80px, 120px 120px",
                  }}
                />
                <div className="relative">
                  <h1 className="text-lg sm:text-xl font-extrabold tracking-wide text-white mb-1.5">
                    GUIDED IMPORTS
                  </h1>
                  <div className="w-10 h-[3px] bg-[#4CAF50] mx-auto rounded-full mb-5" />
                  <div className="w-16 h-16 rounded-full bg-[#4CAF50] flex items-center justify-center mx-auto mb-5">
                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Booking Confirmed</h2>
                  <p className="text-sm sm:text-base text-gray-300/80 max-w-md mx-auto">
                    Thank you for confirming your booking.
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-10 py-6 sm:py-8 space-y-5">
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50/80 border border-gray-100/60">
                  <div className="w-8 h-8 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50] shrink-0 mt-0.5">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Inquiry Number
                    </p>
                    <p className="text-sm font-bold text-[#1B2A4A]">{quoteParam}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  Please check your email for the next steps.
                </p>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Powered by <span className="font-semibold text-gray-500">Guided Imports</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[640px]">
          <div className="bg-white rounded-2xl shadow-xl shadow-[#1B2A4A]/[0.08] border border-gray-200/80 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1B2A4A] to-[#131F36] px-6 sm:px-10 pt-8 sm:pt-10 pb-6 sm:pb-8 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
                  backgroundSize: "100px 100px, 80px 80px, 120px 120px",
                }}
              />
              <div className="relative">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-wide text-white mb-1.5">
                  GUIDED IMPORTS
                </h1>
                <div className="w-10 h-[3px] bg-[#4CAF50] mx-auto rounded-full mb-5" />
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#4CAF50]/20 border border-[#4CAF50]/30 mb-5">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#4CAF50]">
                    Booking Confirmation
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Confirm Your Booking</h2>
                <p className="text-sm sm:text-base text-gray-300/80 max-w-md mx-auto">
                  Please verify your details below to confirm your shipment booking.
                </p>
              </div>
            </div>

            <div className="px-6 sm:px-10 py-6 sm:py-8 space-y-6">
              {/* Inquiry number display */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50/80 border border-gray-100/60">
                <div className="w-8 h-8 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50] shrink-0 mt-0.5">
                  <Hash className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Inquiry Number
                  </p>
                  <p className="text-sm font-bold text-[#1B2A4A]">{quoteParam}</p>
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  <Mail className="w-3.5 h-3.5" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (stage === "error") setStage("form");
                  }}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1B2A4A] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50] transition-all"
                />
              </div>

              {/* Consent checkboxes */}
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Required Consents
                </p>

                <ConsentCheckbox
                  checked={consent1}
                  onChange={setConsent1}
                  label={
                    <>
                      I agree to the{" "}
                      <a
                        href="https://guidedcargo.com/bill-of-lading-terms-conditions/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4CAF50] underline underline-offset-2 hover:text-[#43A047]"
                      >
                        bill of lading terms &amp; conditions
                      </a>
                    </>
                  }
                />
                <ConsentCheckbox
                  checked={consent2}
                  onChange={setConsent2}
                  label={
                    <>
                      I acknowledge the{" "}
                      <a
                        href="https://guidedcargo.com/extra-charges-guide/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4CAF50] underline underline-offset-2 hover:text-[#43A047]"
                      >
                        extra charges guide
                      </a>
                    </>
                  }
                />
                <ConsentCheckbox
                  checked={consent3}
                  onChange={setConsent3}
                  label={
                    <>
                      I understand the{" "}
                      <a
                        href="https://guidedcargo.com/payment-terms/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4CAF50] underline underline-offset-2 hover:text-[#43A047]"
                      >
                        payment terms
                      </a>
                    </>
                  }
                />
              </div>

              {/* Error message */}
              {stage === "error" && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 text-center">
                  {errorMsg}
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || stage === "submitting"}
                className={`w-full font-bold text-base py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  canSubmit && stage !== "submitting"
                    ? "bg-[#4CAF50] text-white shadow-lg shadow-[#4CAF50]/25 hover:shadow-xl hover:shadow-[#4CAF50]/30 hover:bg-[#43A047] active:scale-[0.99]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {stage === "submitting" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Powered by <span className="font-semibold text-gray-500">Guided Imports</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50/80 transition-colors group">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
          checked
            ? "bg-[#4CAF50] border-[#4CAF50]"
            : "bg-white border-gray-300 group-hover:border-gray-400"
        }`}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </button>
      <span className="text-sm text-gray-600 leading-relaxed">{label}</span>
    </label>
  );
}
