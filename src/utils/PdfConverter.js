import { jsPDF } from "jspdf";
import "jspdf-autotable";

const generatePDF = (pages) => {
  const doc = new jsPDF();

  const totalFollowerCount = pages.reduce((sum, page) => sum + parseInt(page.follower_count || 0), 0);
  const totalPages = pages.length;
  const totalPost = pages.reduce((sum, page) => sum + parseInt(page.postPerPage || 0), 0);
  const totalStory = pages.reduce((sum, page) => sum + parseInt(page.storyPerPage || 0), 0);

  const tableColumn = ["Page Name", "Follower Count", "Category", "Posts/Page", "Stories/Page"];
  const tableRows = [];

  pages.forEach(page => {
    const pageData = [
      page.page_name,
      page.follower_count,
      page.cat_name,
      page.postPerPage || 'N/A', 
      page.storyPerPage || 'N/A',
    ];
    tableRows.push(pageData);
  });
  
  doc.text(`Total Follower Count: ${totalFollowerCount}`, 10, 10);
  doc.text(`Total Pages: ${totalPages}`, 10, 20);
  doc.text(`Total Post Count: ${totalPost}`, 10, 30);
  doc.text(`Total Story Count: ${totalStory}`, 10, 40);

  doc.autoTable({
    startY: 50,
    head: [tableColumn],
    body: tableRows,
  });

  doc.save(`page_details_report_${new Date().getTime()}.pdf`);
};

export default generatePDF
