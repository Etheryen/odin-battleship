export default function Footer() {
  const footer = document.createElement('footer');
  const year = new Date().getFullYear();
  footer.innerHTML = `@ ${year} Etheryen`;

  return footer;
}
