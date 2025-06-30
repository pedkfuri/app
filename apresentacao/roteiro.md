**Roteiro de Apresentação do TCC - Pedro A. D. Kfuri**

**Tema:** Integração de IA Generativa On-Premise no Processo de Code Review

---

### **1. Abertura (1-2 min)**

"Boa tarde a todos. Meu nome é Pedro Kfuri, sou aluno do curso de Ciência da Computação da PUC Minas. Hoje, apresentarei meu Trabalho de Conclusão de Curso, cujo tema é a integração de inteligência artificial generativa no processo de revisão de código, de forma local, segura e automatizada.

O objetivo desse trabalho é resolver um problema comum em equipes de desenvolvimento: a demora e o gargalo gerado pelas revisões de código manuais. Utilizando IA generativa e execução local, buscamos automatizar esse processo sem comprometer a segurança dos dados."

---

### **2. Problema e Justificativa (2-3 min)**

"A revisão de código é uma etapa essencial no desenvolvimento de software, garantindo a qualidade, segurança e manutenibilidade do sistema. No entanto, à medida que os times crescem e o volume de código aumenta, as revisões manuais se tornam um gargalo, dependendo da disponibilidade dos revisores.

Esse atraso pode comprometer a produtividade e a fluidez de pipelines de CI/CD. Ao mesmo tempo, surgem modelos de IA generativa que conseguem analisar código, sugerir melhorias e identificar problemas.

No entanto, usar serviços de IA na nuvem pode levantar preocupacões com privacidade, principalmente em projetos fechados ou com dados sensíveis. Por isso, a proposta deste trabalho é usar uma solução local com IA generativa para revisar código automaticamente, garantindo privacidade e agilidade."

---

### **3. Objetivo do Trabalho (1 min)**

"O objetivo principal do trabalho foi desenvolver uma aplicação capaz de automatizar revisões de código utilizando IA generativa, com execução local via a ferramenta Ollama.

Essa aplicação escuta eventos de merge requests do GitLab e pull requests do GitHub, extrai as alterações feitas no código e solicita uma análise automática por um modelo de linguagem local, que retorna um comentário estruturado para ajudar na decisão de aprovação ou rejeição da alteração."

---

### **4. Fundamentação Teórica (3-4 min)**

"Para entender o contexto, alguns conceitos são fundamentais:

Primeiro, revisão de código: trata-se da prática de analisar código-fonte para identificar erros, inconsistências e sugerir melhorias. É uma etapa crítica na garantia da qualidade de software.

Segundo, CI/CD e DevOps: são metodologias que automatizam o ciclo de vida do desenvolvimento, e dependem de revisões rápidas para manter a agilidade.

Terceiro, APIs de GitHub e GitLab: essas plataformas oferecem APIs REST para acessar detalhes de pull e merge requests, como diffs e arquivos alterados.

E por fim, modelos de linguagem como o CodeLlama, Llama 3 e DeepSeek: são modelos capazes de entender e gerar código. O diferencial do Ollama é permitir a execução local desses modelos, sem necessidade de conexão com a nuvem."

---

### **5. Metodologia (4-5 min)**

"A solução desenvolvida é uma aplicação Node.js que implementa um servidor HTTP com Express. Ela recebe eventos de merge requests via webhook e extrai os diffs das alterações usando a API do GitHub ou GitLab, dependendo da configuração.

Esses diffs são enviados para a API local do Ollama, acompanhados de um prompt que guia o modelo: ele deve ignorar formatação e comentar apenas sobre a lógica do código. A resposta é em JSON, com uma nota de 0 a 10 e um conjunto de comentários.

Por fim, o sistema envia esse resultado de volta ao merge request na forma de um comentário automático.

Toda comunicação é feita via HTTPS e em formato JSON. O sistema foi hospedado em uma VPS para possibilitar testes reais com webhooks externos."

---

### **6. Resultados e Análise (3-4 min)**

"Os testes mostraram que o sistema é funcional: ao abrir um pull ou merge request, um comentário automático é gerado com análise do código.

Entretanto, um ponto crítico foi identificado: quando o mesmo diff é enviado várias vezes, o modelo retorna notas diferentes, variando até três pontos na escala de 0 a 10. Isso mostra que a nota atribuída não é consistente, o que inviabiliza seu uso direto como métrica de qualidade ou critério automático de aprovação.

Apesar disso, os comentários gerados se mostraram coerentes e relevantes, podendo ser utilizados como apoio para revisores humanos."

---

### **7. Conclusão (2 min)**

"Esse trabalho demonstrou que é possível automatizar parte da revisão de código utilizando modelos de linguagem generativa, com execução local via Ollama. Isso garante privacidade dos dados, reduz o tempo de revisão e oferece feedback estruturado.

A solução contribui para pipelines de CI/CD mais ágeis e seguros, principalmente em ambientes com alta rotatividade de contribuições.

Entretanto, identificamos limitações, especialmente quanto à consistência de notas atribuídas. A conclusão é que a IA deve atuar como assistente, e não como decisor único."

---

### **8. Trabalhos Futuros (1 min)**

"Como próximos passos, propomos treinar um modelo local com o histórico de código e revisões reais da equipe, aumentando a precisão e alinhamento com o contexto do projeto.

Também pretendemos criar mecanismos de aprovação automática quando a nota superar um certo limiar, desde que acompanhados de métodos de fallback.

E, por fim, aplicar essa solução com desenvolvedores reais para medir impacto em produtividade e qualidade."

---

### **9. Encerramento e Perguntas (1 min)**

"Com isso, encerro minha apresentação. Espero ter demonstrado o potencial da integração de IA generativa local nos fluxos de desenvolvimento de software.

Agradeço a atenção e estou à disposição para perguntas."
