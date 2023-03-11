const options = {
  "PEDIDOS": {
    "baseText": "{{1}} da CAIXA, {{2}} em {{3}}. Desligou-se em {{4}}, \npor meio de adesão ao PADV/PAA. Ocupou no período não prescrito o cargo comissionado de/a função gratificada de {{5}}. Ajuizou ação trabalhista em {{6}}, onde pleiteou a condenação da CAIXA, em síntese, nos seguintes itens: {{7}}",
    "options": [{
      "type": "select",
      "label": "Empregado ou Empregada",
      "values": ["Ex-empregado", "Ex-empregada"]
    },
    {
      "type": "select",
      "label": "Empregado ou Empregada",
      "values": ["admitido", "admitida"]
    },
    {
      "label": "Data de admissão",
      "type": "input"
    },
    {
      "label": "Data de desligamento",
      "type": "input"
    },
    {
      "label": "Cargo",
      "type": "select",
      "values": ["gerente", "caixa", "gerente geral", "supervisor de atendimento"]
    },
    {
      "label": "Data em que ajuizou",
      "type": "input"
    },
    {
      "label": "Pedidos",
      "type": "multi-select",
      "values": [
        "horas extras, consideradas as excedentes à sexta hora diária e trigésima semanal, durante todo o período contratual, com divisor 150, adicional 50% e 100%, com reflexos;",
        "que a Justiça do Trabalho é absolutamente incompetente para processar e julgar assuntos que tratem de previdência privada, como é o caso da FUNCEF;",
        "intervalo do Art. 384 da CLT;",
        "uma hora extra pelo intervalo intrajornada não concedido corretamento;",
      ]
    }
    ]
  }
}
export default options