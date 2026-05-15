#!/bin/bash

# Script per automatizzare Git Add, Commit e Push
# Utilizzo: ./sync.sh "tuo messaggio di commit"

# Prende il messaggio del commit dagli argomenti, altrimenti usa un default con data/ora
MESSAGE=${1:-"Update: $(date +'%Y-%m-%d %H:%M:%S')"}

# Trova il nome del branch corrente
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

# Se non siamo in un repo git, esce
if [ -z "$BRANCH" ]; then
    echo "❌ Errore: questa non sembra una cartella Git."
    exit 1
fi

echo "----------------------------------------"
echo "🚀 Sincronizzazione su branch: $BRANCH"
echo "----------------------------------------"

# Aggiunge tutte le modifiche
echo "📦 Aggiunta file..."
git add .

# Esegue il commit (se ci sono modifiche)
if git commit -m "$MESSAGE"; then
    echo "✅ Commit effettuato: $MESSAGE"
    
    # Esegue il push
    echo "⬆️ Invio modifiche a GitHub..."
    if git push origin "$BRANCH"; then
        echo "----------------------------------------"
        echo "🎉 Tutto sincronizzato correttamente!"
        echo "----------------------------------------"
    else
        echo ""
        echo "❌ Errore durante il push."
        echo "💡 Suggerimento: Se è la prima volta, esegui manualmente 'git push -u origin $BRANCH' per autenticarti."
    fi
else
    echo ""
    echo "⚠️ Nessuna modifica rilevata da committare."
fi
