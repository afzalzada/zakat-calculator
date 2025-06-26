"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Sparkles } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  answerZakatQuestion,
  type AnswerZakatQuestionOutput,
} from "@/ai/flows/zakat-qa"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  question: z.string().min(10, {
    message: "Please ask a clear question, at least 10 characters long.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export function ZakatQA() {
  const [answer, setAnswer] = React.useState<AnswerZakatQuestionOutput | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setAnswer(null)
    try {
      const response = await answerZakatQuestion(values)
      setAnswer(response)
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get an answer. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Ask about Zakat</CardTitle>
          <p className="text-muted-foreground">
            Have a question about Zakat? Our AI assistant can help.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., What is the Nisab for gold?"
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get Answer
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="min-h-[300px] flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                AI Generated Answer
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                )}
                {answer && !isLoading && (
                <div className="space-y-4 text-sm text-muted-foreground whitespace-pre-wrap">
                    {answer.answer}
                </div>
                )}
                {!answer && !isLoading && (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Your answer will appear here.</p>
                </div>
                )}
            </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground px-4 text-center">
            Disclaimer: This AI-powered assistant provides educational information, not religious rulings (fatwa). For binding religious verdicts, please consult a qualified Islamic scholar.
        </p>
      </div>
    </div>
  )
}
