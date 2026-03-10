import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

// Real database IDs extracted from Team relation properties
const DATABASES = {
  listings: '79d946c2-de9e-4330-9941-b27970fe92e2',
  crm: 'a031ad0e-354a-4616-b61d-67138e7cbd2e',
  revenue_log: '25acb408-ff2b-8082-a2d0-dbe58c20b3cc',
  team: '25acb408ff2b80cab435d5732c2ffd0f',
};

export async function GET() {
  // Nur in Development verfuegbar — in Production blockieren
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Explore-Endpunkt ist in Production deaktiviert' },
      { status: 403 }
    );
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const results: Record<string, any> = {};

  for (const [name, dbId] of Object.entries(DATABASES)) {
    try {
      // Get database schema
      const dbInfo = await notion.databases.retrieve({ database_id: dbId });
      const properties = Object.entries(dbInfo.properties).map(
        ([propName, prop]: [string, any]) => ({
          name: propName,
          type: prop.type,
          id: prop.id,
          // For relations, show which database they link to
          ...(prop.type === 'relation' ? { relation_db: prop.relation?.database_id } : {}),
          // For select/multi_select, show options
          ...(prop.type === 'select' ? { options: prop.select?.options?.map((o: any) => o.name) } : {}),
          ...(prop.type === 'multi_select' ? { options: prop.multi_select?.options?.map((o: any) => o.name) } : {}),
          // For status, show options
          ...(prop.type === 'status' ? {
            options: prop.status?.options?.map((o: any) => o.name),
            groups: prop.status?.groups?.map((g: any) => ({ name: g.name, options: g.option_ids }))
          } : {}),
        })
      );

      // Get first 2 sample entries
      const sampleQuery = await notion.databases.query({
        database_id: dbId,
        page_size: 2,
      });

      const samples = sampleQuery.results.map((page: any) => {
        const props = page.properties;
        const extracted: Record<string, any> = { _id: page.id };

        for (const [key, val] of Object.entries(props) as [string, any][]) {
          if (val.type === 'title') {
            extracted[key] = val.title?.[0]?.plain_text ?? '';
          } else if (val.type === 'number') {
            extracted[key] = val.number;
          } else if (val.type === 'formula') {
            extracted[key] = `formula(${val.formula?.type}): ${val.formula?.number ?? val.formula?.string ?? val.formula?.boolean ?? 'null'}`;
          } else if (val.type === 'rollup') {
            extracted[key] = `rollup: ${JSON.stringify(val.rollup)}`;
          } else if (val.type === 'relation') {
            extracted[key] = `relation: [${val.relation?.map((r: any) => r.id).join(', ')}]`;
          } else if (val.type === 'select') {
            extracted[key] = val.select?.name ?? null;
          } else if (val.type === 'status') {
            extracted[key] = val.status?.name ?? null;
          } else if (val.type === 'date') {
            extracted[key] = val.date?.start ?? null;
          } else if (val.type === 'checkbox') {
            extracted[key] = val.checkbox;
          } else if (val.type === 'rich_text') {
            extracted[key] = val.rich_text?.[0]?.plain_text ?? '';
          } else if (val.type === 'created_time') {
            extracted[key] = val.created_time;
          } else if (val.type === 'last_edited_time') {
            extracted[key] = val.last_edited_time;
          } else {
            extracted[key] = `[${val.type}]`;
          }
        }

        return extracted;
      });

      results[name] = {
        title: (dbInfo as any).title?.[0]?.plain_text ?? 'Unbekannt',
        property_count: properties.length,
        properties,
        sample_count: sampleQuery.results.length,
        total_count: sampleQuery.has_more ? '2+' : sampleQuery.results.length,
        samples,
      };
    } catch (error: any) {
      results[name] = {
        error: error.message ?? 'Unknown error',
        hint: 'Stelle sicher, dass die Notion-Integration Zugriff auf diese Datenbank hat (Connections hinzufuegen)',
      };
    }
  }

  return NextResponse.json(results, { status: 200 });
}
