# Backend opcional — Java Lab

Esta pasta contém documentação de uma possível camada intermediária para o executor, não uma implementação de backend pronta.

## Quando seria necessário

Considere uma função serverless ou API intermediária apenas se o executor escolhido exigir uma credencial que não possa ficar no navegador. A camada intermediária deve manter essa credencial no ambiente do servidor e validar limites de tamanho e frequência antes de encaminhar a execução.

## Integração prevista

O cliente do navegador deve apontar para o endpoint intermediário em sua configuração de executor. A implementação real, as variáveis de ambiente e os limites precisam ser documentados e testados antes de usar essa arquitetura.

## Estado atual

O Java Lab atual usa um executor externo configurado pelo cliente. Este README não significa que exista um backend próprio implantado.
