import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SystemConfig from "@/lib/models/SystemConfig";

const CONFIG_KEY = "global_ops_switchboard";

interface ConfigUpdateBody {
  maintenanceMode?: boolean;
  chatbotActive?: boolean;
  soundAlerts?: boolean;
}

export async function GET() {
  try {
    await connectDB();
    let config = await SystemConfig.findOne({ key: CONFIG_KEY });
    
    if (!config) {
      config = await SystemConfig.create({
        key: CONFIG_KEY,
        maintenanceMode: false,
        chatbotActive: true,
        soundAlerts: true
      });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Fetch system config error:", error);
    return NextResponse.json({
      maintenanceMode: false,
      chatbotActive: true,
      soundAlerts: true
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    let body: ConfigUpdateBody = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const update: Partial<ConfigUpdateBody> = {};
    if (typeof body.maintenanceMode === "boolean") update.maintenanceMode = body.maintenanceMode;
    if (typeof body.chatbotActive === "boolean") update.chatbotActive = body.chatbotActive;
    if (typeof body.soundAlerts === "boolean") update.soundAlerts = body.soundAlerts;

    const config = await SystemConfig.findOneAndUpdate(
      { key: CONFIG_KEY },
      { $set: update },
      { upsert: true, new: true }
    );

    return NextResponse.json(config);
  } catch (error) {
    console.error("Update system config error:", error);
    return NextResponse.json({ error: "Failed to update operations switchboard" }, { status: 500 });
  }
}
