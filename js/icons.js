/* =============================================
   ICONS — lucide init + half-star gradient defs
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  if (window.lucide) lucide.createIcons();

  const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgDefs.setAttribute('style', 'width:0;height:0;position:absolute');
  svgDefs.innerHTML = `
    <defs>
      <linearGradient id="half-grad" x1="0" x2="1" y1="0" y2="0">
        <stop offset="50%" stop-color="#F5A623"/>
        <stop offset="50%" stop-color="#E5E4E0"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(svgDefs);

});