import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const mappingPath = path.join(process.cwd(), 'src/data/price-mapping.json');
    
    // Check if the file exists
    if (!fs.existsSync(mappingPath)) {
      return NextResponse.json(
        { error: "Price mapping not found. Run /api/flex/init first." },
        { status: 404 }
      );
    }

    // Read and parse the mapping file
    const mappingContent = fs.readFileSync(mappingPath, 'utf8');
    const priceMapping = JSON.parse(mappingContent);
    
    // Remove any empty values or notes
    const cleanMapping = Object.fromEntries(
      Object.entries(priceMapping).filter(([key, value]) => 
        key !== 'note' && value && typeof value === 'string' && value.length > 0
      )
    );

    return NextResponse.json(cleanMapping);
  } catch (error) {
    console.error("Error reading price mapping:", error);
    return NextResponse.json(
      { error: "Failed to load price mapping" },
      { status: 500 }
    );
  }
}