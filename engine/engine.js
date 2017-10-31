/*
Considerações:
A matriz que representa o canal tem como entradas as linhas e como saída as colunas;
Todas as matrizes aqui utilizadas DEVEM ser criadas com o método Matrix();
*/

var getJointDistribution = function(priorProbability, channelMatrix){
	var jointMatrix = new Matrix();
	var row;
	//multiply each row x of C by the prior probability

	for(var j = 0; j < channelMatrix.columns ; j++){
		row = [];
		for(var i = 0; i < channelMatrix.rows ; i++){
			row.push(priorProbability[i] * channelMatrix.data[i][j]);
		}	
		jointMatrix.addColumn(row);
	}

	return jointMatrix;
}

var getMarginalDistributionColumns = function(jointMatrix){
	var marginalDistribution = [];

	for(var j = 0; j < jointMatrix.columns ; j++){
		var sum = 0;
		for(var i = 0; i < jointMatrix.rows ; i++){
			//multiply each row x of C by the prior prob. Px
			sum += jointMatrix.data[i][j]; 	
		}	
		marginalDistribution.push(sum);
	}
	return marginalDistribution;
}

var getMarginalDistributionRows = function(jointMatrix){
	var marginalDistribution = [];

	for(var i = 0; i < jointMatrix.rows ; i++){
		var sum = 0;
		for(var j = 0; j < jointMatrix.columns ; j++){
			//multiply each row x of C by the prior prob. Px
			sum += jointMatrix.data[i][j]; 	
		}	
		marginalDistribution.push(sum);
	}
	return marginalDistribution;
}

var getPosteriorDistribution = function(jointMatrix, initialMarginalDistribution){
	var marginalDistribution = [];
	//var returnMatrix = new Matrix();


	for(var j = 0; j < jointMatrix.columns ; j++){
		if( jointMatrix.isColumnZero(j)){
			//returnMatrix = jointMatrix.removeColumn(j);
			jointMatrix.removeColumn(j);
			initialMarginalDistribution.splice(j);
		}
		//jointMatrix.addColumnFromMatrix(returnMatrix,j);
		//marginalDistribution.push(initialMarginalDistribution[j]);
	}

	for(var j = 0; j < jointMatrix.columns; j++){
		for(var i = 0; i < jointMatrix.rows ; i++){
			jointMatrix.data[i][j] = jointMatrix.data[i][j]/initialMarginalDistribution[j]; 	
		}	
	}
	
	return {
		matrix: jointMatrix,
		distribution: initialMarginalDistribution
	}
}

var getHyperDistribution = function(posteriorDistributionMatrix, marginalDistributionY){
	// check if there are scaled columns
	var hyperDistributionMatrix = new Matrix();
	var finalMarginalDistribution = [];
	var columnToRemove;
	var removedColumns = [];


	for(var j = 0; j < posteriorDistributionMatrix.columns ; j++){
		if(  removedColumns.includes(j) ){
			continue;
		}

		finalMarginalDistribution.push(marginalDistributionY[j]);

		columnToRemove = posteriorDistributionMatrix.firstMultipleOfColumn(j);
		if(columnToRemove == -1){
			hyperDistributionMatrix.addColumnFromMatrix(posteriorDistributionMatrix, j);
		}
		else{
			while( columnToRemove != -1){

				hyperDistributionMatrix  = posteriorDistributionMatrix.removeColumn( columnToRemove);
				removedColumns.push(columnToRemove);
				finalMarginalDistribution[j] += marginalDistributionY[ columnToRemove ];
		
				columnToRemove = posteriorDistributionMatrix.firstMultipleOfColumn(j);			
			}	
		}
	}

	return {
		matrix: posteriorDistributionMatrix, 
		distribution: finalMarginalDistribution 
	};
}

var getEntropy = function(array){
	var entropy = 0;
	for(var i = 0 ; i < array.length ; i++){
		entropy += (array[i] == 0)? 0 : array[i] * [ Math.log( 1/ array[i] ) / Math.log(2) ];
	}

	return entropy;
}

var getConditionalEntropyRows = function(matrix){
	var arrayResult = [];
	for( var i = 0 ; i < matrix.rows ; i++){
		
		arrayResult.push(getEntropy(matrix.data[i]));
		
	}
	return arrayResult;
}

var getConditionalEntropyColumns = function(matrix){
	var columnArray;
	var arrayResult = [];
	for(var j = 0 ; j < matrix.columns ; j++){
		columnArray = []
		for(var i = 0; i < matrix.rows; i++){
			columnArray.push(matrix.data[i][j]);
		}
		arrayResult.push(getEntropy(columnArray));
	}
	return arrayResult;
}

var sumArray = function(array){
	var result = 0;
	for( var i = 0 ; i < array.length ; i++){		
		result += array[i];		
	}
	return result;
}