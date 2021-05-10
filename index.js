const api = require('./api');
console.log('Iniciando monitoramento!');
setInterval(async () => {
    console.log('Mercado para BNBBUSD');
    const mercado = await api.depth('BNBBUSD');
    console.log(mercado.bids.length ? `Compra: ${mercado.bids[0][0]}` : 'Sem Compras');
    console.log(mercado.asks.length ? `Venda: ${mercado.asks[0][0]}` : 'Sem Vendas');
 
    console.log('Carteira');
    const carteira = await api.accountInfo();
    const coins = carteira.balances.filter(b => b.asset === 'BNB' || b.asset === 'BUSD');
    console.log(coins);
 
    const sellPrice = parseFloat(mercado.asks[0][0]);
    //const carteiraBUSD = parseFloat(coins.find(c => c.asset === 'BUSD').free);
    if (sellPrice < 1000) {
        console.log('Preço está bom. Comprando!');
        const buyOrder = await api.newOrder('BNBBUSD', 1);
        console.log(`orderId: ${buyOrder.orderId}`);
        console.log(`status: ${buyOrder.status}`);
 
        const profitability = parseFloat(process.env.PROFITABILITY);
        const sellOrder = await api.newOrder('BNBBUSD', 1, sellPrice * profitability, 'SELL', 'LIMIT');
        console.log(sellOrder);
        console.log(`orderId: ${sellOrder.orderId}`);
        console.log(`status: ${sellOrder.status}`);
    }
}, process.env.CRAWLER_INTERVAL);