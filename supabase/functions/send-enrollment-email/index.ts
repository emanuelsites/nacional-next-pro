import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentEmailRequest {
  courseName: string;
  courseDate: string;
  enrollmentType: string;
  nomeCompleto: string | null;
  cpf: string | null;
  rg: string | null;
  dataNascimento: string | null;
  cargo: string | null;
  matricula: string | null;
  setor: string | null;
  nomeEmpresa: string | null;
  cnpj: string | null;
  telefoneFixo: string | null;
  telefoneCelular: string;
  email: string;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  responsavelNome: string | null;
  responsavelCargo: string | null;
  responsavelTelefone: string | null;
  responsavelEmail: string | null;
}

function buildEmailHtml(data: EnrollmentEmailRequest): string {
  const isPF = data.enrollmentType === "pessoa_fisica";
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #E84E24, #F5A623); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 16px; font-weight: bold; color: #E84E24; margin-bottom: 10px; border-bottom: 2px solid #E84E24; padding-bottom: 5px; }
    .field { margin-bottom: 8px; }
    .label { font-weight: bold; color: #555; }
    .value { color: #333; }
    .footer { text-align: center; padding: 15px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nova Inscrição Recebida</h1>
      <p>Nacional Treinamentos</p>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Informações do Curso</div>
        <div class="field"><span class="label">Curso:</span> <span class="value">${data.courseName}</span></div>
        <div class="field"><span class="label">Data:</span> <span class="value">${data.courseDate || 'A informar'}</span></div>
        <div class="field"><span class="label">Tipo de Inscrição:</span> <span class="value">${isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}</span></div>
      </div>
      
      ${isPF ? `
      <div class="section">
        <div class="section-title">Dados do Participante</div>
        <div class="field"><span class="label">Nome Completo:</span> <span class="value">${data.nomeCompleto || '-'}</span></div>
        <div class="field"><span class="label">CPF:</span> <span class="value">${data.cpf || '-'}</span></div>
        <div class="field"><span class="label">RG:</span> <span class="value">${data.rg || '-'}</span></div>
        <div class="field"><span class="label">Data de Nascimento:</span> <span class="value">${data.dataNascimento || '-'}</span></div>
        <div class="field"><span class="label">Cargo:</span> <span class="value">${data.cargo || '-'}</span></div>
        <div class="field"><span class="label">Matrícula:</span> <span class="value">${data.matricula || '-'}</span></div>
        <div class="field"><span class="label">Setor:</span> <span class="value">${data.setor || '-'}</span></div>
      </div>
      ` : `
      <div class="section">
        <div class="section-title">Dados da Empresa/Órgão</div>
        <div class="field"><span class="label">Nome da Empresa/Órgão:</span> <span class="value">${data.nomeEmpresa || '-'}</span></div>
        <div class="field"><span class="label">CNPJ:</span> <span class="value">${data.cnpj || '-'}</span></div>
      </div>
      <div class="section">
        <div class="section-title">Responsável pela Inscrição</div>
        <div class="field"><span class="label">Nome:</span> <span class="value">${data.responsavelNome || '-'}</span></div>
        <div class="field"><span class="label">Cargo:</span> <span class="value">${data.responsavelCargo || '-'}</span></div>
        <div class="field"><span class="label">Telefone:</span> <span class="value">${data.responsavelTelefone || '-'}</span></div>
        <div class="field"><span class="label">E-mail:</span> <span class="value">${data.responsavelEmail || '-'}</span></div>
      </div>
      `}
      
      <div class="section">
        <div class="section-title">Contato</div>
        <div class="field"><span class="label">Telefone Fixo:</span> <span class="value">${data.telefoneFixo || '-'}</span></div>
        <div class="field"><span class="label">Celular:</span> <span class="value">${data.telefoneCelular || '-'}</span></div>
        <div class="field"><span class="label">E-mail:</span> <span class="value">${data.email || '-'}</span></div>
      </div>
      
      <div class="section">
        <div class="section-title">Endereço</div>
        <div class="field"><span class="label">CEP:</span> <span class="value">${data.cep || '-'}</span></div>
        <div class="field"><span class="label">Logradouro:</span> <span class="value">${data.endereco || '-'}</span></div>
        <div class="field"><span class="label">Número:</span> <span class="value">${data.numero || '-'}</span></div>
        <div class="field"><span class="label">Complemento:</span> <span class="value">${data.complemento || '-'}</span></div>
        <div class="field"><span class="label">Bairro:</span> <span class="value">${data.bairro || '-'}</span></div>
        <div class="field"><span class="label">Cidade:</span> <span class="value">${data.cidade || '-'}</span></div>
        <div class="field"><span class="label">UF:</span> <span class="value">${data.uf || '-'}</span></div>
      </div>
    </div>
    <div class="footer">
      <p>Este e-mail foi enviado automaticamente pelo sistema de inscrições da Nacional Treinamentos.</p>
    </div>
  </div>
</body>
</html>
  `;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send enrollment email");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EnrollmentEmailRequest = await req.json();
    console.log("Enrollment data received for:", data.nomeCompleto || data.nomeEmpresa);

    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpUser || !smtpPassword) {
      console.error("SMTP credentials not configured");
      throw new Error("SMTP credentials not configured");
    }

    const participantName = data.nomeCompleto || data.nomeEmpresa || 'Participante';
    const htmlContent = buildEmailHtml(data);
    const subject = `Nova Inscrição: ${data.courseName} - ${participantName}`;

    console.log("Connecting to SMTP server...");
    
    const client = new SmtpClient();
    
    await client.connectTLS({
      hostname: "mail.nacionaltreinamentos.com.br",
      port: 587,
      username: smtpUser,
      password: smtpPassword,
    });

    console.log("Connected, sending email to main recipient...");

    // Send to main recipient
    await client.send({
      from: smtpUser,
      to: "contato@nacionaltreinamentos.com.br",
      subject: subject,
      content: "text/html",
      html: htmlContent,
    });

    console.log("Sending copy to BCC...");

    // Send copy to BCC recipient
    await client.send({
      from: smtpUser,
      to: "emanuel001@gmail.com",
      subject: subject,
      content: "text/html",
      html: htmlContent,
    });

    await client.close();

    console.log("Emails sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending enrollment email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
