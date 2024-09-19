function calcularPrestamo() {
    const capital = parseFloat(document.getElementById('capital').value);
    const tasa = parseFloat(document.getElementById('tasa').value) / 100;
    const meses = parseInt(document.getElementById('meses').value);
    const metodo = document.getElementById('metodo').value;
    const tasaGastosAdministrativos = parseFloat(document.getElementById('gastosAdministrativos').value) / 100;
    const tasaGastosBancarios = parseFloat(document.getElementById('gastosBancarios').value) / 100;
    const tasaImpuestoSellado = parseFloat(document.getElementById('impuestoSellado').value) / 100;
    const tasaSeguro = parseFloat(document.getElementById('tasaSeguro').value) / 100;
    const importeSolicitud = parseFloat(document.getElementById('importeSolicitud').value);

    // Cálculo de gastos
    const gastosAdministrativos = capital * tasaGastosAdministrativos;
    const gastosBancarios = capital * tasaGastosBancarios;
    const deduccionesTotales = gastosAdministrativos + gastosBancarios + importeSolicitud;

    let resultado = '<table><tr><th>Cuota</th><th>Capital</th><th>Interés</th><th>Seguro</th><th>Total</th></tr>';
    let totalCapital = 0;
    let totalInteres = 0;
    let totalSeguro = 0;
    let totalPago = 0;
    let capitalRestante = capital;
    let interesRestante = 0;

    if (metodo === 'frances') {
        const pagoMensual = (capital * tasa) / (1 - Math.pow(1 + tasa, -meses));
        interesRestante = (pagoMensual * meses) - capital;
        for (let i = 1; i <= meses; i++) {
            const interes = capitalRestante * tasa;
            const capitalCuota = pagoMensual - interes;
            saldoRestante = capitalRestante + interesRestante;
            const seguro = saldoRestante * tasaSeguro;
            interesRestante -= interes
            capitalRestante -= capitalCuota;
            totalCapital += capitalCuota;
            totalInteres += interes;
            totalSeguro += seguro;
            totalPago += (pagoMensual + seguro);
            resultado += `<tr><td>${i}</td><td>${capitalCuota.toFixed(2)}</td><td>${interes.toFixed(2)}</td><td>${seguro.toFixed(2)}</td><td>${(pagoMensual + seguro).toFixed(2)}</td></tr>`;
        }
    } else if (metodo === 'aleman') {
        const capitalMensual = capital / meses;
        for (let i = 1; i <= meses; i++) {
            const interes = capitalRestante * tasa;
            const netoPeriodo = capitalRestante + interes;
            const seguro = netoPeriodo * tasaSeguro;
            const total = capitalMensual + interes + seguro;
            capitalRestante -= capitalMensual;
            totalCapital += capitalMensual;
            totalInteres += interes;
            totalSeguro += seguro;
            totalPago += total;
            resultado += `<tr><td>${i}</td><td>${capitalMensual.toFixed(2)}</td><td>${interes.toFixed(2)}</td><td>${seguro.toFixed(2)}</td><td>${total.toFixed(2)}</td></tr>`;
        }
    } else if (metodo === 'directo') {
        const interesMensual = capital * tasa;
        const capitalMensual = capital / meses;
        saldoRestante = (capitalMensual + interesMensual) * meses
        for (let i = 1; i <= meses; i++) {
            const seguro = saldoRestante * tasaSeguro;
            const pagoMensual = capitalMensual + interesMensual + seguro;
            saldoRestante -= (capitalMensual + interesMensual)
            totalCapital += capitalMensual;
            totalInteres += interesMensual;
            totalSeguro += seguro;
            totalPago += pagoMensual;
            resultado += `<tr><td>${i}</td><td>${capitalMensual.toFixed(2)}</td><td>${interesMensual.toFixed(2)}</td><td>${seguro.toFixed(2)}</td><td>${pagoMensual.toFixed(2)}</td></tr>`;
        }
    }

    // Cálculo del impuesto de sellado
    const interesTotalParaSellado = totalInteres;
    const impuestoSellado = (capital + interesTotalParaSellado + gastosAdministrativos) * tasaImpuestoSellado;

    resultado += `<tr><th>Total</th><th>${totalCapital.toFixed(2)}</th><th>${totalInteres.toFixed(2)}</th><th>${totalSeguro.toFixed(2)}</th><th>${totalPago.toFixed(2)}</th></tr>`;
    resultado += '</table>';
    document.getElementById('resultado').innerHTML = resultado;

    // Cálculo de TNA, TEA y CFT
    const TNA = tasa * 12 * 100;
    const TEA = (Math.pow(1 + tasa, 12) - 1) * 100;
    //const CFT = ((totalPago / (capital * meses)) - 1) * 100;
    const CFT = ((totalPago + totalSeguro + gastosAdministrativos + gastosBancarios + importeSolicitud + impuestoSellado) / capital) * 100

    // Mostrar resumen de todos los importes
    document.getElementById('resultado').innerHTML += `
        <p><strong>Resumen de Importes:</strong></p>
        <p><strong>Monto del Préstamo:</strong> ${capital.toFixed(2)}</p>
        <p><strong>Interés Total:</strong> ${totalInteres.toFixed(2)}</p>
        <p><strong>Gastos Administrativos:</strong> ${gastosAdministrativos.toFixed(2)}</p>
        <p><strong>Gastos Bancarios:</strong> ${gastosBancarios.toFixed(2)}</p>
        <p><strong>Impuesto de Sellado:</strong> ${impuestoSellado.toFixed(2)}</p>
        <p><strong>Importe de Solicitud:</strong> ${importeSolicitud.toFixed(2)}</p>
        <p><strong>Seguro Total:</strong> ${totalSeguro.toFixed(2)}</p>
        <p><strong>Total del Préstamo:</strong> ${totalPago.toFixed(2)}</p>
        <p><strong>Importe Neto a Cobrar:</strong> ${(capital - deduccionesTotales - impuestoSellado).toFixed(2)}</p>
        <p><strong>Tasa Nominal Anual (TNA):</strong> ${TNA.toFixed(2)}%</p>
        <p><strong>Tasa Efectiva Anual (TEA):</strong> ${TEA.toFixed(2)}%</p>
        <p><strong>Costo Financiero Total (CFT):</strong> ${CFT.toFixed(2)}%</p>
    `;
}
