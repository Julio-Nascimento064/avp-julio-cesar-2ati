-- CreateTable
CREATE TABLE `filmes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` CHAR(100) NOT NULL,
    `diretor` CHAR(100) NOT NULL,
    `anoLancamento` CHAR(4) NOT NULL,
    `personagemPrincipal` CHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
