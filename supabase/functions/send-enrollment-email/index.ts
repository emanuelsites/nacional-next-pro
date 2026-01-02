import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Participante {
  nome: string;
  telefone_comercial: string;
  telefone_celular: string;
  email: string;
}

interface EnrollmentEmailRequest {
  courseName: string;
  courseDate: string;
  enrollmentType: string;
  dadosGerais: {
    razao_social: string;
    endereco: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
    cnpj_cpf: string;
    telefone_comercial: string;
    telefone_celular: string;
    email: string;
  };
  responsavelInscricao: {
    nome: string;
    telefone_comercial: string;
    telefone_celular: string;
    email: string;
  };
  responsavelPagamento: {
    nome: string;
    telefone_comercial: string;
    telefone_celular: string;
    email: string;
  };
  participantes: Participante[];
}

function buildEmailHtml(data: EnrollmentEmailRequest): string {
  const isPF = data.enrollmentType === "pessoa_fisica";
  
  const participantesHtml = data.participantes.map((p, index) => `
    <div style="margin-bottom: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
      <strong>Participante ${index + 1}:</strong><br/>
      Nome: ${p.nome || '-'}<br/>
      Tel. Comercial: ${p.telefone_comercial || '-'}<br/>
      Tel. Celular: ${p.telefone_celular || '-'}<br/>
      E-mail: ${p.email || '-'}
    </div>
  `).join('');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
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
      <h1 style="margin: 0;">Nova Inscrição Recebida</h1>
      <p style="margin: 5px 0 0 0;">Nacional Treinamentos</p>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title">Informações do Curso</div>
        <div class="field"><span class="label">Curso:</span> <span class="value">${data.courseName}</span></div>
        <div class="field"><span class="label">Data:</span> <span class="value">${data.courseDate || 'A informar'}</span></div>
        <div class="field"><span class="label">Tipo de Inscrição:</span> <span class="value">${isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}</span></div>
      </div>
      
      <div class="section">
        <div class="section-title">${isPF ? 'Dados Pessoais' : 'Dados da Empresa/Órgão'}</div>
        <div class="field"><span class="label">Razão Social/Nome:</span> <span class="value">${data.dadosGerais.razao_social || '-'}</span></div>
        <div class="field"><span class="label">${isPF ? 'CPF' : 'CNPJ'}:</span> <span class="value">${data.dadosGerais.cnpj_cpf || '-'}</span></div>
        <div class="field"><span class="label">Endereço:</span> <span class="value">${data.dadosGerais.endereco || '-'}</span></div>
        <div class="field"><span class="label">Bairro:</span> <span class="value">${data.dadosGerais.bairro || '-'}</span></div>
        <div class="field"><span class="label">CEP:</span> <span class="value">${data.dadosGerais.cep || '-'}</span></div>
        <div class="field"><span class="label">Cidade/UF:</span> <span class="value">${data.dadosGerais.cidade || '-'} / ${data.dadosGerais.uf || '-'}</span></div>
        <div class="field"><span class="label">Tel. Comercial:</span> <span class="value">${data.dadosGerais.telefone_comercial || '-'}</span></div>
        <div class="field"><span class="label">Tel. Celular:</span> <span class="value">${data.dadosGerais.telefone_celular || '-'}</span></div>
        <div class="field"><span class="label">E-mail:</span> <span class="value">${data.dadosGerais.email || '-'}</span></div>
      </div>
      
      <div class="section">
        <div class="section-title">Responsável pela Inscrição</div>
        <div class="field"><span class="label">Nome:</span> <span class="value">${data.responsavelInscricao.nome || '-'}</span></div>
        <div class="field"><span class="label">Tel. Comercial:</span> <span class="value">${data.responsavelInscricao.telefone_comercial || '-'}</span></div>
        <div class="field"><span class="label">Tel. Celular:</span> <span class="value">${data.responsavelInscricao.telefone_celular || '-'}</span></div>
        <div class="field"><span class="label">E-mail:</span> <span class="value">${data.responsavelInscricao.email || '-'}</span></div>
      </div>
      
      <div class="section">
        <div class="section-title">Responsável pelo Pagamento</div>
        <div class="field"><span class="label">Nome:</span> <span class="value">${data.responsavelPagamento.nome || '-'}</span></div>
        <div class="field"><span class="label">Tel. Comercial:</span> <span class="value">${data.responsavelPagamento.telefone_comercial || '-'}</span></div>
        <div class="field"><span class="label">Tel. Celular:</span> <span class="value">${data.responsavelPagamento.telefone_celular || '-'}</span></div>
        <div class="field"><span class="label">E-mail:</span> <span class="value">${data.responsavelPagamento.email || '-'}</span></div>
      </div>
      
      <div class="section">
        <div class="section-title">Participantes (${data.participantes.length})</div>
        ${participantesHtml}
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

async function sendEmailViaSMTP(
  smtpHost: string,
  smtpPort: number,
  username: string,
  password: string,
  from: string,
  to: string,
  subject: string,
  htmlContent: string
): Promise<void> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  console.log(`Connecting to ${smtpHost}:${smtpPort}...`);
  
  const conn = await Deno.connect({
    hostname: smtpHost,
    port: smtpPort,
  });

  const read = async (): Promise<string> => {
    const buffer = new Uint8Array(1024);
    const n = await conn.read(buffer);
    if (n === null) return "";
    return decoder.decode(buffer.subarray(0, n));
  };

  const write = async (data: string): Promise<void> => {
    await conn.write(encoder.encode(data + "\r\n"));
  };

  const sendCommand = async (command: string, expectedCode?: string): Promise<string> => {
    console.log(`> ${command.startsWith("AUTH") ? "AUTH ***" : command}`);
    await write(command);
    const response = await read();
    console.log(`< ${response.trim()}`);
    if (expectedCode && !response.startsWith(expectedCode)) {
      throw new Error(`SMTP Error: Expected ${expectedCode}, got: ${response}`);
    }
    return response;
  };

  try {
    // Read greeting
    const greeting = await read();
    console.log(`< ${greeting.trim()}`);

    // EHLO
    await sendCommand(`EHLO localhost`, "250");

    // AUTH LOGIN
    await sendCommand("AUTH LOGIN", "334");
    
    // Send username (base64)
    await sendCommand(btoa(username), "334");
    
    // Send password (base64)
    await sendCommand(btoa(password), "235");

    // MAIL FROM
    await sendCommand(`MAIL FROM:<${from}>`, "250");

    // RCPT TO
    await sendCommand(`RCPT TO:<${to}>`, "250");

    // DATA
    await sendCommand("DATA", "354");

    // Create email content with headers
    const boundary = "----=_Part_0_" + Date.now();
    const emailContent = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=UTF-8`,
      `Content-Transfer-Encoding: base64`,
      ``,
      btoa(unescape(encodeURIComponent(htmlContent))),
      ``,
      `--${boundary}--`,
      `.`
    ].join("\r\n");

    await conn.write(encoder.encode(emailContent + "\r\n"));
    const dataResponse = await read();
    console.log(`< ${dataResponse.trim()}`);

    // QUIT
    await sendCommand("QUIT", "221");

  } finally {
    conn.close();
  }
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received request to send enrollment email");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EnrollmentEmailRequest = await req.json();
    console.log("Enrollment data received for:", data.dadosGerais.razao_social);

    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");

    if (!smtpUser || !smtpPassword) {
      console.error("SMTP credentials not configured");
      throw new Error("SMTP credentials not configured");
    }

    const participantName = data.dadosGerais.razao_social || 'Participante';
    const htmlContent = buildEmailHtml(data);
    const subject = `Nova Inscrição: ${data.courseName} - ${participantName}`;

    // Send to main recipient
    console.log("Sending email to contato@nacionaltreinamentos.com.br...");
    await sendEmailViaSMTP(
      "mail.nacionaltreinamentos.com.br",
      587,
      smtpUser,
      smtpPassword,
      smtpUser,
      "contato@nacionaltreinamentos.com.br",
      subject,
      htmlContent
    );

    // Send copy to BCC recipient
    console.log("Sending copy to emanuel001@gmail.com...");
    await sendEmailViaSMTP(
      "mail.nacionaltreinamentos.com.br",
      587,
      smtpUser,
      smtpPassword,
      smtpUser,
      "emanuel001@gmail.com",
      subject,
      htmlContent
    );

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
