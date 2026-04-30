const prisma = require('./src/prisma').default;
async function main() {
  const reports = await prisma.report.findMany({ orderBy: { uploadedAt: 'desc' }, take: 1 });
  console.log(reports.map(r => ({ fileName: r.fileName, notes: r.notes })));
}
main().finally(() => prisma.$disconnect());
