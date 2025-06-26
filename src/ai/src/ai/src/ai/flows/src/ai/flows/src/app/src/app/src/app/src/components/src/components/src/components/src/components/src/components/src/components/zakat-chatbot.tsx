"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Send, Sparkles, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  answerZakatQuestion,
} from "@/ai/flows/zakat-qa"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { cn } from "@/lib/utils"
import { useI18n } from "@/hooks/use-i18n"

const formSchema = z.object({
  question: z.string().min(10, {
    message: "Please ask a clear question, at least 10 characters long.",
  }),
})

type FormValues = z.infer<typeof formSchema>
type Message = {
    role: 'user' | 'assistant';
    content: string;
}

export function ZakatChatbot() {
  const { t } = useI18n();
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  })

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])


  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: values.question }])
    form.reset();

    try {
      const response = await answerZakatQuestion(values)
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }])
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get an answer. Please try again.",
      })
      // remove the user's message if the call fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <div className="bg-background border border-primary/50 p-3 rounded-lg shadow-lg hidden md:block transition-all hover:shadow-xl">
            <p className="text-sm font-medium text-primary">{t('chatbot_cta')}</p>
        </div>
        <Sheet>
            <SheetTrigger asChild>
                <Button className="h-16 w-16 rounded-full shadow-lg" size="icon">
                    <Sparkles className="h-8 w-8" />
                    <span className="sr-only">{t('chatbot_sr_open')}</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="font-headline text-2xl flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-accent" />
                        {t('chatbot_title')}
                    </SheetTitle>
                    <SheetDescription>
                        {t('chatbot_description')}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-grow pr-4 -mr-6 my-4">
                    <div className="space-y-4 py-4">
                        {messages.length === 0 && (
                             <div className="flex items-center justify-center h-full text-center text-muted-foreground p-8">
                                <p>{t('chatbot_placeholder')}</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' && "justify-end")}>
                                {message.role === 'assistant' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            <Sparkles className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "p-3 rounded-lg max-w-xs md:max-w-sm break-words", 
                                    message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                                )}>
                                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                                </div>
                                 {message.role === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            <User className="h-5 w-5" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        <Sparkles className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="p-3 rounded-lg bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <div className="mt-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 pt-4 border-t">
                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormControl>
                                    <Textarea
                                        placeholder={t('chatbot_input_placeholder')}
                                        className="resize-none"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                if (!isLoading && form.getValues('question').length > 0) {
                                                    form.handleSubmit(onSubmit)();
                                                }
                                            }
                                        }}
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage className="absolute text-xs" />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" size="icon" disabled={isLoading || form.getValues('question').length === 0}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">{t('chatbot_sr_send')}</span>
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    </div>
  )
}
