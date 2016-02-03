/**
 * Created by IATGOF on 03/02/2016.
 */

var CacheLink = {
    create: function (entity, link) {
        return {
            entity: entity,
            link: link
        }
    }
};

var Cache = {
    buildEntitiesGeneratedRelationCache: function (race) {
        GameRaceInternals.foreachEntity(race, function (entity) {
            if (entity.generatesEntities()) {
                for (var i = 0; i < entity.generates.length; i++) {
                    var generated = entity.generates[i].getEntityIdentifier();
                    var targetEntity = race.getEntity(generated);
                    if (targetEntity.generatedBy === undefined) {
                        targetEntity.generatedBy = []
                    }
                    targetEntity.generatedBy.push(CacheLink.create(entity, entity.generates[i]))
                }
            }
        });
    },
    
    buildAffectedEntitiesRelationCache: function (race) {
        GameRaceInternals.foreachEntity(race, function (entity) {
            if (entity.affectsEntities()) {
                for (var i = 0; i < entity.affects.length; i++) {
                    var effect = entity.affects[i];
                    var targetEntity = race.getEntity(effect.getEntityIdentifier());
                    var subarray = targetEntity[effect.type];
                    if (subarray) {
                        for (var j = 0; j < subarray.length; j++) {
                            var relation = subarray[j];
                            if (effect.subentity === undefined || effect.subentity == relation.getEntityIdentifier()) {
                                if (relation.affectedBy === undefined) {
                                    relation.affectedBy = []
                                }
                                relation.affectedBy.push(CacheLink.create(entity, effect))
                            }
                        }
                    }
                }
            }
        });
    }
};
