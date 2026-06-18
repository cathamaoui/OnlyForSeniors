import Link from "next/link";
import { ArrowLeft, Mail, Phone, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact — Only For Seniors",
  description: "Get in touch with Only For Seniors.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-touch px-4 py-2 border-2 border-stone-500 text-stone-800 font-semibold text-base hover:bg-stone-50"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <h1 className="text-xl font-display font-bold">Contact</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <section>
          <p className="inline-block text-base font-bold   bg-black text-white px-3 py-1 rounded-full">
            We'd love to hear from you
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display font-black leading-normal">
            Send us a message.
          </h2>
          <p className="mt-3 text-lg text-stone-700 leading-relaxed">
            Whether you want to suggest a category, report an issue with a listing, or
            ask a question about the site — drop us a line and we'll get back to you.
          </p>
        </section>

        <section className="bg-white border border-stone-200 rounded-lg p-6">
          <h3 className="font-display font-bold text-xl mb-4">Send a message</h3>
          <form className="space-y-3">
            <div>
              <label className="block text-base font-semibold mb-1">Your name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                className="w-full px-3 py-2 border-2 border-stone-500 rounded focus:border-blue-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">Email</label>
              <input
                type="email"
                placeholder="jane@example.com"
                className="w-full px-3 py-2 border-2 border-stone-500 rounded focus:border-blue-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">What's this about?</label>
              <select className="w-full px-3 py-2 border-2 border-stone-500 rounded focus:border-blue-700 focus:outline-none bg-white">
                <option>Suggest a business or category</option>
                <option>Report a problem with a listing</option>
                <option>Question about the site</option>
                <option>Partnership inquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-semibold mb-1">Message</label>
              <textarea
                rows={5}
                placeholder="How can we help?"
                className="w-full px-3 py-2 border-2 border-stone-500 rounded focus:border-blue-700 focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="w-full sm:w-auto px-8 py-3 bg-blue-700 text-white font-display font-bold rounded-lg hover:bg-blue-800"
            >
              Send message
            </button>
          </form>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-stone-200 rounded-lg p-5 text-center">
            <Mail className="w-6 h-6 text-blue-700 mx-auto" />
            <h3 className="font-display font-bold text-base mt-2">Email</h3>
            <a href="mailto:hello@onlyforseniors.ca" className="text-base text-stone-700 hover:underline block">
              hello@onlyforseniors.ca
            </a>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-5 text-center">
            <Phone className="w-6 h-6 text-blue-700 mx-auto" />
            <h3 className="font-display font-bold text-base mt-2">Phone</h3>
            <p className="text-base text-stone-700">Coming soon</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-lg p-5 text-center">
            <MessageSquare className="w-6 h-6 text-blue-700 mx-auto" />
            <h3 className="font-display font-bold text-base mt-2">Mailing address</h3>
            <p className="text-base text-stone-700">Coming soon</p>
          </div>
        </section>
      </div>
    </div>
  );
}
