import Link from "next/link";
import { ArrowLeft, Mail, Phone, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact — Only For Seniors",
  description: "Get in touch with Only For Seniors.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 bg-white text-stone-900 border border-stone-200 rounded-full font-semibold text-base hover:bg-stone-50 hover:border-stone-900"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-12 space-y-8">
        <section>
          <p className="inline-block text-base font-bold bg-stone-900 text-white px-3 py-1 rounded-full">
            We'd love to hear from you
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-black leading-normal text-stone-900">
            Send us a message.
          </h2>
          <p className="mt-3 text-lg text-stone-700 leading-relaxed">
            Whether you want to suggest a category, report an issue with a listing, or
            ask a question about the site — drop us a line and we'll get back to you.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="font-display font-bold text-xl text-stone-900 mb-4">Send a message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-base font-bold text-stone-900 mb-1">Your name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-stone-900 border-2 border-stone-500 rounded-lg focus:border-stone-900 focus:ring-4 focus:ring-stone-200 placeholder:text-stone-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-stone-900 mb-1">Email</label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-stone-900 border-2 border-stone-500 rounded-lg focus:border-stone-900 focus:ring-4 focus:ring-stone-200 placeholder:text-stone-500"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-stone-900 mb-1">What's this about?</label>
              <select className="w-full min-h-touch px-4 py-3 text-lg bg-white text-stone-900 border-2 border-stone-500 rounded-lg focus:border-stone-900 focus:ring-4 focus:ring-stone-200">
                <option>Suggest a business or category</option>
                <option>Report a problem with a listing</option>
                <option>Question about the site</option>
                <option>Partnership inquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-bold text-stone-900 mb-1">Message</label>
              <textarea
                rows={5}
                placeholder="How can we help?"
                className="w-full min-h-touch px-4 py-3 text-lg bg-white text-stone-900 border-2 border-stone-500 rounded-lg focus:border-stone-900 focus:ring-4 focus:ring-stone-200 placeholder:text-stone-500"
              />
            </div>
            <button
              type="button"
              className="w-full sm:w-auto min-h-touch px-8 py-3 bg-stone-900 text-white border border-stone-900 font-display font-bold text-lg rounded-full hover:bg-black"
            >
              Send message
            </button>
          </form>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 bg-stone-900 text-white rounded-lg mb-2">
              <Mail className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-bold text-base text-stone-900">Email</h3>
            <a href="mailto:hello@onlyforseniors.ca" className="text-base text-stone-700 hover:text-black hover:underline block">
              hello@onlyforseniors.ca
            </a>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 bg-stone-900 text-white rounded-lg mb-2">
              <Phone className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-bold text-base text-stone-900">Phone</h3>
            <p className="text-base text-stone-700">Coming soon</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <span aria-hidden="true" className="inline-flex items-center justify-center w-10 h-10 bg-stone-900 text-white rounded-lg mb-2">
              <MessageSquare className="w-5 h-5" strokeWidth={2.25} />
            </span>
            <h3 className="font-display font-bold text-base text-stone-900">Mailing address</h3>
            <p className="text-base text-stone-700">Coming soon</p>
          </div>
        </section>
      </div>
    </div>
  );
}
