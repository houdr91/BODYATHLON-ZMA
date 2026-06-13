"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Loader2,
  ShieldCheck,
  Truck,
  Lock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Link } from "@/navigation";
import { ProductBottle } from "@/components/ProductBottle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ZMA_PRODUCT } from "@/types";

const FREE_SHIPPING_THRESHOLD = 60;

function formatEuro(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function CheckoutClient() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const t = useTranslations("checkout");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const subtotal = Math.round(quantity * ZMA_PRODUCT.price * 100) / 100;
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : 4.95;
  const total = Math.round((subtotal + shipping) * 100) / 100;

  const placeOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        toast({
          variant: "destructive",
          title: t("errorTitle"),
          description: data.error ?? t("errorDesc"),
        });
        return;
      }

      const data = await response.json();
      setOrderId(data.order.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-dark-400 pb-24 pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {orderId ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass mx-auto max-w-xl rounded-3xl p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
              >
                <CheckCircle2 className="mx-auto h-20 w-20 text-brand-400" />
              </motion.div>
              <h1 className="mt-6 font-display text-4xl tracking-wide text-white">
                {t("successTitle")}
              </h1>
              <p className="mt-3 text-slate-400">
                {t("successDesc", { name: session?.user?.name ?? "atleta", id: orderId })}
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Button asChild className="bg-brand-600 hover:bg-brand-500">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t("backToStore")}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="font-display text-5xl tracking-wide text-white">
                TU <span className="text-brand-400">{t("title")}</span>
              </h1>
              <p className="mt-2 text-slate-400">
                {t("greeting", { name: session?.user?.name ?? "atleta" })}
              </p>

              <div className="mt-10 grid gap-8 lg:grid-cols-5">
                <Card className="glass border-white/10 bg-transparent lg:col-span-3">
                  <CardContent className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center">
                    <div className="mx-auto w-28 shrink-0 sm:mx-0">
                      <ProductBottle className="h-auto w-full" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-white">{t("product")}</h2>
                      <p className="mt-1 text-sm text-slate-400">{t("productDesc")}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-white/15 bg-transparent text-white hover:bg-white/10"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            disabled={quantity <= 1}
                            aria-label={t("decreaseQty")}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-lg font-bold text-white" aria-live="polite">
                            {quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-white/15 bg-transparent text-white hover:bg-white/10"
                            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                            disabled={quantity >= 10}
                            aria-label={t("increaseQty")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs text-slate-500 line-through">
                            {formatEuro(quantity * ZMA_PRODUCT.compareAtPrice)}
                          </span>
                          <span className="text-xl font-bold text-white">{formatEuro(subtotal)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass h-fit border-white/10 bg-transparent lg:col-span-2">
                  <CardContent className="space-y-4 p-7">
                    <h2 className="text-lg font-bold text-white">{t("summary")}</h2>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between text-slate-400">
                        <span>{t("subtotal")}</span>
                        <span>{formatEuro(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>{t("shipping")}</span>
                        <span className={freeShipping ? "text-brand-400" : ""}>
                          {freeShipping ? t("shippingFree") : formatEuro(shipping)}
                        </span>
                      </div>
                      {!freeShipping && (
                        <p className="text-xs text-slate-600">
                          {t("shippingThreshold", { amount: formatEuro(FREE_SHIPPING_THRESHOLD) })}
                        </p>
                      )}
                      <div className="border-t border-white/10 pt-3">
                        <div className="flex justify-between text-base font-bold text-white">
                          <span>{t("total")}</span>
                          <span>{formatEuro(total)}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={placeOrder}
                      disabled={loading}
                      className="btn-shimmer glow-green h-12 w-full bg-brand-600 font-bold text-white hover:bg-brand-500"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t("processing")}
                        </>
                      ) : (
                        t("confirm")
                      )}
                    </Button>

                    <div className="space-y-2 pt-2 text-xs text-slate-500">
                      <p className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5 text-brand-500" /> {t("sslBadge")}
                      </p>
                      <p className="flex items-center gap-2">
                        <Truck className="h-3.5 w-3.5 text-brand-500" /> {t("shippingBadge")}
                      </p>
                      <p className="flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5 text-brand-500" /> {t("guaranteeBadge")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
