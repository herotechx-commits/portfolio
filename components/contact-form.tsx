"use client"
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useForm, ValidationError } from '@formspree/react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mail, Send, CheckCircle, XCircle, X, Copy, Check } from "lucide-react";
import { IconBrandFiverr, IconBrandGithub, IconBrandGoogle, IconBrandLinkedin, IconBrandNotion, IconBrandUpwork, IconBrandWhatsapp } from "@tabler/icons-react";
import { BottomGradient } from "./ui/bottom-gradient";
import { LabelInputContainer } from "./ui/label-input-container";
import { useToast } from "@/hooks/use-toast";

// Define types for form data
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Define types for form errors
interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm(): React.ReactElement {
  const [state, handleSubmit] = useForm("mldwznve");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [emailCopied, setEmailCopied] = useState(false);
  const { successToast, errorToast } = useToast();
  
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }
    
    return newErrors;
  };

  // Helper function to check if formspree has field errors
  const hasFormspreeError = (fieldName: string): boolean => {
    return Array.isArray(state.errors) && state.errors.some((error: any) => error.field === fieldName);
  };

  // Function to copy email to clipboard
  const copyEmailToClipboard = async (): Promise<void> => {
    const email = "herotechx@gmail.com"; // Fixed the typo from "gmial" to "gmail"
    
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      successToast('Email copied to clipboard!');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setEmailCopied(true);
      successToast('Email copied to clipboard!');
      
      setTimeout(() => {
        setEmailCopied(false);
      }, 2000);
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      errorToast("error", "Please fix the errors below");
      return;
    }
    
    // Submit to Formspree
    await handleSubmit(e);
    successToast('Successfully Sent');
  };

  // Handle success/error states from Formspree
  useEffect(() => {
    if (state.succeeded) {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    }
  }, [state.succeeded]);

  useEffect(() => {
    if (Array.isArray(state.errors) && state.errors.length > 0) {
      alert("There was an error sending your message. Please try again.");
    }
  }, [state.errors]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="shadow-input mx-auto w-full rounded-none p-4 md:rounded-2xl md:p-8">
        <h3 className="text-xl font-semibold text-white mb-4">Let's Work Together</h3>        

        <form onSubmit={handleFormSubmit} className="my-8">
          <LabelInputContainer className="mb-4">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={cn(
                errors.name || hasFormspreeError('name') ? "border-red-500" : ""
              )}
              required
            />
            {errors.name && (
              <span className="text-xs text-red-500 mt-1">{errors.name}</span>
            )}
            <ValidationError 
              prefix="Name" 
              field="name"
              errors={state.errors}
              className="text-xs text-red-500 mt-1"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="john@example.com"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={cn(
                errors.email || hasFormspreeError('email') ? "border-red-500" : ""
              )}
              required
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-1">{errors.email}</span>
            )}
            <ValidationError 
              prefix="Email" 
              field="email"
              errors={state.errors}
              className="text-xs text-red-500 mt-1"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Project Inquiry"
              type="text"
              value={formData.subject}
              onChange={handleInputChange}
              className={cn(
                errors.subject || hasFormspreeError('subject') ? "border-red-500" : ""
              )}
              required
            />
            {errors.subject && (
              <span className="text-xs text-red-500 mt-1">{errors.subject}</span>
            )}
            <ValidationError 
              prefix="Subject" 
              field="subject"
              errors={state.errors}
              className="text-xs text-red-500 mt-1"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-8">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell me about your project..."
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              className={cn(
                "flex w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_#262626] group-hover/input:shadow-none transition duration-400 resize-none",
                errors.message || hasFormspreeError('message') ? "border-red-500" : ""
              )}
              required
            />
            {errors.message && (
              <span className="text-xs text-red-500 mt-1">{errors.message}</span>
            )}
            <ValidationError 
              prefix="Message" 
              field="message"
              errors={state.errors}
              className="text-xs text-red-500 mt-1"
            />
          </LabelInputContainer>

          <button
            className={cn(
              "group/btn relative block h-12 w-full rounded-md font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] transition-all duration-200",
              state.submitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-gradient-to-br from-black to-neutral-600 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 hover:shadow-lg"
            )}
            type="submit"
            disabled={state.submitting}
          >
            <span className="flex items-center justify-center space-x-2">
              {state.submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"/>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </span>
            <BottomGradient />
          </button>
        </form>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Or reach out directly via email
          </p>
          <button
            onClick={copyEmailToClipboard}
            className="group inline-flex items-center space-x-2 text-sm p-4 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 cursor-pointer rounded-md hover:bg-gray-800"
          >
            <span>herotechx@gmail.com</span>
            {emailCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            )}
          </button>
          <div className="flex justify-center mt-5 gap-5">
            <a 
              href="https://www.linkedin.com/in/nuhu-ibrahim-128565383?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BEn5ZmykFQEKBnIyUXJy7cw%3D%3D"
              className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandLinkedin size={25} />
            </a>
            {/* <a 
              href="https://wa.me/your-number" // Replace with actual WhatsApp link
              className="inline-flex items-center space-x-2 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandWhatsapp size={25} />
            </a> */}
            {/* <a 
              href="https://herotechx@gmail.com" // Replace with actual email
              className="inline-flex items-center space-x-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              <IconBrandGoogle size={25}/>
            </a> */}
            <a 
              href="https://github.com/herotechx-commits" // Replace with actual GitHub profile
              className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub size={25} />
            </a>
            {/* <a 
              href="https://www.notion.so/4f740704069142079c0fa1a5d7e0e5fa" // Replace with actual Notion link
              className="inline-flex items-center space-x-2 text-sm text-black hover:text-gray-800 dark:text-white dark:hover:text-gray-300 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandNotion size={25}/>
            </a> */}
            <a 
              href="https://fiverr.com/your-profile" // Replace with actual Fiverr profile
              className="inline-flex items-center space-x-2 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandFiverr size={25}/>
            </a>
            <a 
              href="https://upwork.com/freelancers/your-profile" // Replace with actual Upwork profile
              className="inline-flex items-center space-x-2 text-sm text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandUpwork size={25}/>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
