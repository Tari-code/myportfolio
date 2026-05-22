import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Ticket from "@/lib/models/Ticket";

async function saveTicket(message: string, userId: string) {
  try {
    await connectDB();

    // Check for existing open ticket for this user in the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingTicket = await Ticket.findOne({
      user: userId,
      status: "open",
      createdAt: { $gte: yesterday }
    });

    if (existingTicket) {
      return "ACTIVE_TICKET";
    }

    const newTicket = await Ticket.create({
      user: userId,
      message,
      status: "open",
    });
    return newTicket._id.toString();
  } catch (error) {
    console.error("Error saving ticket", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { message, userId = `guest_${Math.floor(Math.random() * 10000)}` } = await req.json();

    const lowerMsg = message.toLowerCase();
    let response = "";
    let isTicket = false;

    // Advanced Next-Gen Vocabulary & Conversational Agent
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
      response = "Hello! Welcome to Tari Tech. How can I assist you with your business needs or technical inquiries today?";
    } 
    else if (lowerMsg.includes("hadassah")) {
      response = "Hadassah is an exceptionally talented computer scientist, researcher, and software engineer. She specializes in advanced algorithms, machine learning, and scalable software architectures. If you want to collaborate or know more about her research, let me know, or reach out directly!";
    } 
    else if (lowerMsg.includes("services catalog") || lowerMsg.includes("services") || lowerMsg.includes("offer") || lowerMsg.includes("do you do")) {
      response = "We offer premium high-performance Web Development (React/Next.js/Node), bespoke UI/UX Design, Custom Software Engineering, AI & LLM Model Integrations, and Scalable Cloud Architecture on Vercel and AWS. How can we elevate your digital product?";
    } 
    else if (lowerMsg.includes("project quote estimator") || lowerMsg.includes("estimator") || lowerMsg.includes("estimate") || lowerMsg.includes("quote") || lowerMsg.includes("budget") || lowerMsg.includes("pricing") || lowerMsg.includes("price") || lowerMsg.includes("cost")) {
      response = "You can calculate budget ranges and deployment timelines directly inside your Client Dashboard! Select target features, complexity, and launch date to receive a live interactive quote, and instantly lock it in to create an active support ticket request.";
    } 
    else if (lowerMsg.includes("paul gambo") || lowerMsg.includes("paul") || lowerMsg.includes("gambo") || lowerMsg.includes("ceo") || lowerMsg.includes("founder")) {
      response = "Paul Gambo is the Founder, CEO, and Principal Engineer of Tari Tech. As a highly skilled computer scientist, full-stack engineer, and visionary tech leader, he focuses on designing reliable software systems that empower modern enterprises. Click 'View My Portfolio' on the About page to read his personal career study!";
    } 
    else if (lowerMsg.includes("open a support ticket") || lowerMsg.includes("support ticket") || lowerMsg.includes("ticket") || lowerMsg.includes("support")) {
      response = "If you have a customized technical support inquiry, a project proposal, or a general question, simply type it here! If I am unable to answer, I will automatically initialize a Support Ticket for you, and our expert engineers will respond within 2 hours.";
    } 
    else if (lowerMsg.includes("contact") || lowerMsg.includes("email") || lowerMsg.includes("phone") || lowerMsg.includes("reach")) {
      response = "You can reach our enterprise office directly at contact@tari.com, or give our team a call at +234 912 925 4467.";
    } 
    else if (lowerMsg.includes("team") || lowerMsg.includes("who are you") || lowerMsg.includes("about")) {
      response = "We are a team of expert engineers, creative UI/UX designers, and systems architects dedicated to building world-class next-generation digital products.";
    } 
    else if (lowerMsg.includes("portfolio") || lowerMsg.includes("work") || lowerMsg.includes("projects")) {
      response = "Explore our featured engineering projects in the 'Work' section above! We have built industry-leading platforms across FinTech, E-Commerce, Healthcare, and SaaS.";
    } 
    else if (lowerMsg.includes("tech") || lowerMsg.includes("stack") || lowerMsg.includes("react") || lowerMsg.includes("next")) {
      response = "We specialize in modern, ultra-fast tech stacks, including React, Next.js, Node.js, TypeScript, Python/Django, MongoDB, and secure serverless hosting on Vercel and AWS.";
    } 
    else if (lowerMsg.includes("career") || lowerMsg.includes("job") || lowerMsg.includes("apply") || lowerMsg.includes("join") || lowerMsg.includes("internship")) {
      response = "We are always searching for passionate innovators! Check our Careers portal or open a support ticket to pitch your expertise to our team.";
    } 
    else if (lowerMsg.includes("security") || lowerMsg.includes("privacy") || lowerMsg.includes("gdpr") || lowerMsg.includes("secure")) {
      response = "Our systems operate under military-grade data protection, utilizing strict session tokens, encrypted passwords, and compliant database isolation. Your information is 100% secure.";
    } 
    else if (lowerMsg.includes("hours") || lowerMsg.includes("time") || lowerMsg.includes("when are you active")) {
      response = "Tari Tech operates 24/7/365. Our automated AI systems are online at all times, and our human operations team answers tickets between 8:00 AM and 6:00 PM (GMT+1) daily.";
    } 
    else {
      // Fallback: Generate an automated ticket for tough questions
      const ticketId = await saveTicket(message, userId);
      isTicket = true;
      if (ticketId === "ACTIVE_TICKET") {
        response = "You already have an active support ticket open with this query. Our expert team will review it and reply directly to your dashboard as soon as possible!";
        isTicket = false; // Don't highlight as a NEW ticket in UI
      } else if (ticketId) {
        response = `That is a specific technical question! I have automatically opened a Support Ticket for you so our human engineering unit can assist you. (Ticket ID: #${ticketId.slice(-4)})`;
      } else {
        response = "I am not entirely sure about that. Please contact our support team directly at support@tari.com.";
      }
    }

    // Simulate network delay for realistic next-gen feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({ response, isTicket });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
