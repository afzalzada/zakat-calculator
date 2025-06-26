'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useI18n } from "@/hooks/use-i18n";

const faqKeys = [
  { q: "faq_q1", a: "faq_a1" },
  { q: "faq_q2", a: "faq_a2" },
  { q: "faq_q3", a: "faq_a3" },
  { q: "faq_q4", a: "faq_a4" },
  { q: "faq_q5", a: "faq_a5" },
];


export function Faq() {
  const { t } = useI18n();

  return (
    <Card className="max-w-4xl mx-auto">
        <CardHeader className="items-center text-center bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="font-headline text-3xl">{t('faq_title')}</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {faqKeys.map((item, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="font-semibold text-left">{t(item.q)}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                            {t(item.a)}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
    </Card>
  )
}
