const options = {
  "PEDIDOS": {
    "textoBase": "{{1}} da CAIXA, {{2}} em {{3}}. Desligou-se em {{4}}, por meio de adesão ao PADV/PAA. Ocupou no período não prescrito o cargo comissionado de/a função gratificada de {{5}}. Ajuizou ação trabalhista em {{6}}, onde pleiteou a condenação da CAIXA, em síntese, nos seguintes itens: {{7}}",
    "opcoes": [{
      "tipo": "texto",
      "legenda": "Empregado ou Empregada",
      "valores": ["Ex-empregado", "Ex-empregada"]
    },
    {
      "tipo": "texto",
      "legenda": "Empregado ou Empregada",
      "valores": ["admitido", "admitida"]
    },
    {
      "legenda": "Data de admissão",
      "tipo": "texto-input"
    },
    {
      "legenda": "Data de desligamento",
      "tipo": "texto-input"
    },
    {
      "legenda": "Cargo",
      "tipo": "texto",
      "valores": ["gerente", "caixa", "gerente geral", "supervisor de atendimento"]
    },
    {
      "legenda": "Data em que ajuizou",
      "tipo": "texto-input"
    },
    {
      "legenda": "Pedidos",
      "tipo": "multiplos-textos",
      "valores": [
        "horas extras, consideradas as excedentes à sexta hora diária e trigésima semanal, durante todo o período contratual, com divisor 150, adicional 50% e 100%, com reflexos;",
        "que a Justiça do Trabalho é absolutamente incompetente para processar e julgar assuntos que tratem de previdência privada, como é o caso da FUNCEF;",
        "intervalo do Art. 384 da CLT;",
        "uma hora extra pelo intervalo intrajornada não concedido corretamento;",
      ]
    }
    ]
  },
  "PRELIMINAR DE CONTESTAÇÃO": {
    "textoBase": "Na sua defesa a CAIXA alegou preliminarmente: {{1}}",
    "opcoes": [{
      "tipo": "multiplos-textos",
      "valores": [
        "que a Justiça do Trabalho é absolutamente incompetente para processar e julgar assuntos que tratem de previdência privada, como é o caso da FUNCEF"
      ]
    }]
  },
  "CONTESTAÇÃO": {
    "textoBase": "NNo mérito, a CAIXA contestou todos os pedidos, em resumo: {{1}}",
    "opcoes": [{
      "tipo": "multiplos-textos",
      "valores": [
        "que o autor cumpriu corretamente o intervalo intrajornada",
        "que o autor era detentor de função de confiança, como jornada de 8 horas, devidamente enquadrada no Art. 224, §2º, da CLT"
      ]
    }]
  },
  "SENTENÇA": {
    "textoBase": "NNo mérito, a CAIXA contestou todos os pedidos, em resumo: {{1}}",
    "opcoes": [{
      "tipo": "multiplos-textos",
      "valores": [
        "horas extras, consideradas as realizadas a partir da 6ª hora diária e 30ª semanal",
        "uma hora extra diária pelo intervalo intrajornada não concedido corretamente"
      ]
    }]
  }
}
export default options