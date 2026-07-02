import type { Locale } from '$lib/i18n';

export interface LineageMember {
	id: string;
	slug?: string;
	names: Record<Locale, string>;
	title?: Record<Locale, string>;
	reign?: string;
	children?: LineageMember[];
}

export interface Lineage {
	id: string;
	names: Record<Locale, string>;
	description: Record<Locale, string>;
	color: string;
	members: LineageMember[];
}

export const lineages: Lineage[] = [
	{
		id: 'septim',
		names: {
			fr: 'Dynastie Septim',
			en: 'Septim Dynasty',
			es: 'Dinastía Septim'
		},
		description: {
			fr: "La dynastie impériale fondée par Tiber Septim, qui régna sur tout Tamriel pendant la Troisième Ère.",
			en: 'The imperial dynasty founded by Tiber Septim, which ruled all of Tamriel during the Third Era.',
			es: 'La dinastía imperial fundada por Tiber Septim, que gobernó todo Tamriel durante la Tercera Era.'
		},
		color: '#c9a227',
		members: [
			{
				id: 'tiber-septim',
				slug: 'tiber-septim',
				names: { fr: 'Tiber Septim', en: 'Tiber Septim', es: 'Tiber Septim' },
				title: {
					fr: 'Fondateur de la Dynastie',
					en: 'Dynasty Founder',
					es: 'Fundador de la Dinastía'
				},
				reign: '2E 854 - 3E 38',
				children: [
					{
						id: 'pelagius-i',
						names: { fr: 'Pelagius Ier', en: 'Pelagius I', es: 'Pelagius I' },
						title: {
							fr: 'Empereur de Tamriel',
							en: 'Emperor of Tamriel',
							es: 'Emperador de Tamriel'
						},
						reign: '3E 38 - 3E 41',
						children: [
							{
								id: 'kintyra-i',
								names: { fr: 'Kintyra Ière', en: 'Kintyra I', es: 'Kintyra I' },
								title: {
									fr: 'Impératrice de Tamriel',
									en: 'Empress of Tamriel',
									es: 'Emperatriz de Tamriel'
								},
								reign: '3E 41 - 3E 53',
								children: [
									{
										id: 'uriel-i',
										names: { fr: 'Uriel Ier', en: 'Uriel I', es: 'Uriel I' },
										title: {
											fr: 'Empereur de Tamriel',
											en: 'Emperor of Tamriel',
											es: 'Emperador de Tamriel'
										},
										reign: '3E 53 - 3E 98',
										children: [
											{
												id: 'uriel-ii',
												names: { fr: 'Uriel II', en: 'Uriel II', es: 'Uriel II' },
												title: {
													fr: 'Empereur de Tamriel',
													en: 'Emperor of Tamriel',
													es: 'Emperador de Tamriel'
												},
												reign: '3E 98 - 3E 127',
												children: [
													{
														id: 'pelagius-ii',
														names: { fr: 'Pelagius II', en: 'Pelagius II', es: 'Pelagius II' },
														title: {
															fr: 'Empereur de Tamriel',
															en: 'Emperor of Tamriel',
															es: 'Emperador de Tamriel'
														},
														reign: '3E 127 - 3E 140',
														children: [
															{
																id: 'antiochus',
																names: { fr: 'Antiochus', en: 'Antiochus', es: 'Antiochus' },
																title: {
																	fr: 'Empereur de Tamriel',
																	en: 'Emperor of Tamriel',
																	es: 'Emperador de Tamriel'
																},
																reign: '3E 140 - 3E 153',
																children: [
																	{
																		id: 'kintyra-ii',
																		names: { fr: 'Kintyra II', en: 'Kintyra II', es: 'Kintyra II' },
																		title: {
																			fr: 'Impératrice de Tamriel',
																			en: 'Empress of Tamriel',
																			es: 'Emperatriz de Tamriel'
																		},
																		reign: '3E 153 - 3E 155'
																	}
																]
															},
															{
																id: 'cephorus-i',
																names: { fr: 'Cephorus Ier', en: 'Cephorus I', es: 'Cephorus I' },
																title: {
																	fr: 'Empereur de Tamriel',
																	en: 'Emperor of Tamriel',
																	es: 'Emperador de Tamriel'
																},
																reign: '3E 127 - 3E 140'
															},
															{
																id: 'magnus',
																names: { fr: 'Magnus', en: 'Magnus', es: 'Magnus' },
																title: {
																	fr: 'Empereur de Tamriel',
																	en: 'Emperor of Tamriel',
																	es: 'Emperador de Tamriel'
																},
																reign: '3E 140 - 3E 145',
																children: [
																	{
																		id: 'pelagius-iii',
																		names: { fr: 'Pelagius III', en: 'Pelagius III', es: 'Pelagius III' },
																		title: {
																			fr: 'Pelagius le Fou',
																			en: 'Pelagius the Mad',
																			es: 'Pelagius el Loco'
																		},
																		reign: '3E 145 - 3E 153'
																	}
																]
															}
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				]
			},
			{
				id: 'uriel-v',
				names: { fr: 'Uriel V', en: 'Uriel V', es: 'Uriel V' },
				title: {
					fr: 'Le Conquérant',
					en: 'The Conqueror',
					es: 'El Conquistador'
				},
				reign: '3E 268 - 3E 290',
				children: [
					{
						id: 'uriel-vi',
						names: { fr: 'Uriel VI', en: 'Uriel VI', es: 'Uriel VI' },
						title: {
							fr: 'Empereur de Tamriel',
							en: 'Emperor of Tamriel',
							es: 'Emperador de Tamriel'
						},
						reign: '3E 290 - 3E 320'
					},
					{
						id: 'morihatha',
						names: { fr: 'Morihatha', en: 'Morihatha', es: 'Morihatha' },
						title: {
							fr: 'Impératrice de Tamriel',
							en: 'Empress of Tamriel',
							es: 'Emperatriz de Tamriel'
						},
						reign: '3E 320 - 3E 339',
						children: [
							{
								id: 'pelagius-iv',
								names: { fr: 'Pelagius IV', en: 'Pelagius IV', es: 'Pelagius IV' },
								title: {
									fr: 'Empereur de Tamriel',
									en: 'Emperor of Tamriel',
									es: 'Emperador de Tamriel'
								},
								reign: '3E 339 - 3E 368',
								children: [
									{
										id: 'uriel-vii',
										slug: 'uriel-septim-vii',
										names: { fr: 'Uriel Septim VII', en: 'Uriel Septim VII', es: 'Uriel Septim VII' },
										title: {
											fr: 'Dernier grand Empereur Septim',
											en: 'Last great Septim Emperor',
											es: 'Último gran Emperador Septim'
										},
										reign: '3E 368 - 3E 433',
										children: [
											{
												id: 'martin-septim',
												slug: 'martin-septim',
												names: { fr: 'Martin Septim', en: 'Martin Septim', es: 'Martin Septim' },
												title: {
													fr: 'Dernier Empereur Septim',
													en: 'Last Septim Emperor',
													es: 'Último Emperador Septim'
												},
												reign: '3E 433'
											}
										]
									}
								]
							}
						]
					}
				]
			}
		]
	},
	{
		id: 'mede',
		names: {
			fr: 'Dynastie Mede',
			en: 'Mede Dynasty',
			es: 'Dinastía Mede'
		},
		description: {
			fr: "La dynastie qui succéda aux Septim après la Crise d'Oblivion, fondée par Titus Mede Ier.",
			en: 'The dynasty that succeeded the Septims after the Oblivion Crisis, founded by Titus Mede I.',
			es: 'La dinastía que sucedió a los Septim después de la Crisis de Oblivion, fundada por Titus Mede I.'
		},
		color: '#8b4513',
		members: [
			{
				id: 'titus-mede-i',
				names: { fr: 'Titus Mede Ier', en: 'Titus Mede I', es: 'Titus Mede I' },
				title: {
					fr: 'Fondateur de la Dynastie',
					en: 'Dynasty Founder',
					es: 'Fundador de la Dinastía'
				},
				reign: '4E 17 - 4E ??',
				children: [
					{
						id: 'attrebus-mede',
						names: { fr: 'Attrebus Mede', en: 'Attrebus Mede', es: 'Attrebus Mede' },
						title: {
							fr: 'Prince Impérial',
							en: 'Imperial Prince',
							es: 'Príncipe Imperial'
						},
						children: [
							{
								id: 'mede-unknown',
								names: {
									fr: 'Empereurs intermédiaires',
									en: 'Intermediate Emperors',
									es: 'Emperadores intermedios'
								},
								title: {
									fr: 'Succession incertaine',
									en: 'Uncertain succession',
									es: 'Sucesión incierta'
								},
								children: [
									{
										id: 'titus-mede-ii',
										slug: 'titus-mede-ii',
										names: { fr: 'Titus Mede II', en: 'Titus Mede II', es: 'Titus Mede II' },
										title: {
											fr: 'Empereur pendant la Grande Guerre',
											en: 'Emperor during the Great War',
											es: 'Emperador durante la Gran Guerra'
										},
										reign: '4E ?? - 4E 201'
									}
								]
							}
						]
					}
				]
			}
		]
	},
	{
		id: 'direnni',
		names: {
			fr: 'Clan Direnni',
			en: 'Direnni Clan',
			es: 'Clan Direnni'
		},
		description: {
			fr: "Un clan d'Altmer qui s'établit en Haute-Roche et domina la région pendant l'Ère Méréthique et la Première Ère.",
			en: 'A clan of Altmer who settled in High Rock and dominated the region during the Merethic Era and First Era.',
			es: 'Un clan de Altmer que se estableció en Roca Alta y dominó la región durante la Era Merética y la Primera Era.'
		},
		color: '#4a90d9',
		members: [
			{
				id: 'aiden-direnni',
				names: { fr: 'Aiden Direnni', en: 'Aiden Direnni', es: 'Aiden Direnni' },
				title: {
					fr: 'Chef du Clan',
					en: 'Clan Leader',
					es: 'Líder del Clan'
				},
				children: [
					{
						id: 'raven-direnni',
						names: { fr: 'Raven Direnni', en: 'Raven Direnni', es: 'Raven Direnni' },
						title: {
							fr: 'Enchanteur légendaire',
							en: 'Legendary Enchanter',
							es: 'Encantador legendario'
						}
					},
					{
						id: 'ryain-direnni',
						names: { fr: 'Ryain Direnni', en: 'Ryain Direnni', es: 'Ryain Direnni' },
						title: {
							fr: 'Héros de la Bataille de Glenumbra',
							en: 'Hero of the Battle of Glenumbra',
							es: 'Héroe de la Batalla de Glenumbra'
						},
						reign: '1E 482'
					},
					{
						id: 'corvus-direnni',
						names: { fr: 'Corvus Direnni', en: 'Corvus Direnni', es: 'Corvus Direnni' },
						title: {
							fr: 'Seigneur de Balfiera',
							en: 'Lord of Balfiera',
							es: 'Señor de Balfiera'
						}
					}
				]
			},
			{
				id: 'medora-direnni',
				names: { fr: 'Medora Direnni', en: 'Medora Direnni', es: 'Medora Direnni' },
				title: {
					fr: 'Sorcière de l\'Île de Balfiera',
					en: 'Witch of Balfiera Isle',
					es: 'Bruja de la Isla de Balfiera'
				}
			}
		]
	},
	{
		id: 'tribunal',
		names: {
			fr: 'Le Tribunal',
			en: 'The Tribunal',
			es: 'El Tribunal'
		},
		description: {
			fr: "Les trois dieux-rois de Morrowind qui acquirent leur divinité grâce au Cœur de Lorkhan.",
			en: 'The three god-kings of Morrowind who obtained their divinity through the Heart of Lorkhan.',
			es: 'Los tres dioses-reyes de Morrowind que obtuvieron su divinidad a través del Corazón de Lorkhan.'
		},
		color: '#9b59b6',
		members: [
			{
				id: 'vivec',
				slug: 'vivec',
				names: { fr: 'Vivec', en: 'Vivec', es: 'Vivec' },
				title: {
					fr: 'Dieu-Poète guerrier',
					en: 'Warrior-Poet God',
					es: 'Dios Guerrero-Poeta'
				},
				reign: '1E 700 - 3E 427'
			},
			{
				id: 'almalexia',
				slug: 'almalexia',
				names: { fr: 'Almalexia', en: 'Almalexia', es: 'Almalexia' },
				title: {
					fr: 'La Dame Miséricordieuse',
					en: 'The Merciful Lady',
					es: 'La Dama Misericordiosa'
				},
				reign: '1E 700 - 3E 427'
			},
			{
				id: 'sotha-sil',
				slug: 'sotha-sil',
				names: { fr: 'Sotha Sil', en: 'Sotha Sil', es: 'Sotha Sil' },
				title: {
					fr: 'Le Dieu de l\'Artifice',
					en: 'The God of Artifice',
					es: 'El Dios del Artificio'
				},
				reign: '1E 700 - 3E 427'
			}
		]
	}
];

export function getLineage(id: string): Lineage | undefined {
	return lineages.find((l) => l.id === id);
}
